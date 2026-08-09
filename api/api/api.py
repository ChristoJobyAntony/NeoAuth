import json
import re
import threading
from typing import List

from fastapi import Depends, FastAPI, Header, HTTPException, status
from fastapi.middleware.cors import CORSMiddleware
from fastapi.responses import FileResponse
from fastapi.security import OAuth2PasswordRequestForm
from sqlalchemy.orm import Session

from . import auth, curd, models, schemas
from .config import (
    CORS_ORIGINS,
    IMAGE_SET_POOL,
    IMAGES_DIR,
    MAX_OBJECTS,
    METRICS_TOKEN,
    MIN_OBJECTS,
    OBJECTS_SVG_DIR,
)
from .database import SessionLocal, engine, get_db, wait_for_db
from .objects import uploadObjects

wait_for_db()
models.Base.metadata.create_all(engine)
uploadObjects(next(get_db()))


def _pregenerate_pool():
    """Keep a pool of image sets ready so challenge issuance stays fast."""
    db = SessionLocal()
    try:
        curd.ensure_image_set_pool(db, IMAGE_SET_POOL)
    finally:
        db.close()


threading.Thread(target=_pregenerate_pool, daemon=True).start()

app = FastAPI()

app.add_middleware(
    CORSMiddleware,
    allow_origins=CORS_ORIGINS,
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)


# OAuth2 Dependency
async def get_current_user(token: str = Depends(auth.oauth2_scheme), db: Session = Depends(get_db)):
    credentials_exception = HTTPException(
        status_code=status.HTTP_401_UNAUTHORIZED,
        detail="Could not validate credentials",
        headers={"WWW-Authenticate": "Bearer"},
    )
    email = auth.get_email_from_token(token)
    if email is None:
        raise credentials_exception
    user = curd.get_user(db, email)
    if user is None:
        raise credentials_exception
    return user


@app.get("/")
async def root():
    return {"message": "Hello World from Neo Auth API"}


@app.post("/auth/challenge", response_model=schemas.Challenge)
def issue_challenge(user: schemas.UserBase, db: Session = Depends(get_db)):
    """Issue a single-use, short-lived challenge: an ordered list of image
    sets, one secret object to be identified per set."""
    if not curd.get_user(db, user.email):
        raise HTTPException(status_code=400, detail="Invalid email")
    curd.purge_expired_challenges(db)
    challenge = curd.create_challenge(db, user.email)
    image_sets = [curd.get_image_set(db, uid) for uid in json.loads(challenge.set_uids)]
    return {"uid": challenge.uid, "image_sets": image_sets}


@app.post("/auth/token", response_model=schemas.Token)
def get_token(form: OAuth2PasswordRequestForm = Depends(), db: Session = Depends(get_db)):
    invalid = HTTPException(status_code=400, detail="Invalid Credentials")

    parts = form.password.split("-")
    if len(parts) < 1 + MIN_OBJECTS:
        raise invalid
    challenge_uid, image_uids = parts[0], parts[1:]

    # The challenge must exist, belong to this account, and be unused and
    # unexpired; it is burned on this attempt regardless of the outcome.
    challenge = curd.get_challenge(db, challenge_uid)
    if not challenge or challenge.email != form.username:
        raise invalid
    if not curd.consume_challenge(db, challenge):
        raise HTTPException(status_code=400, detail="Challenge expired — please try again")

    if not (MIN_OBJECTS <= len(image_uids) <= MAX_OBJECTS):
        raise invalid
    user = curd.get_user(db, form.username)
    if not user:
        raise invalid

    # Each response image must come from the challenge's image-set at the
    # same position (ordered response, one image per set).
    set_uids = json.loads(challenge.set_uids)
    images = [curd.get_image(db, uid) for uid in image_uids]
    if not all(images):
        raise invalid
    for position, image in enumerate(images):
        if image.set_id != set_uids[position]:
            raise invalid

    for image in images:
        curd.increment_attempt(db, image.image_set)

    if auth.authenticate_user(user, images):
        return {"access_token": auth.create_access_token(user), "token_type": "bearer"}
    raise invalid


@app.post("/auth/register/email")
def validate_email(user: schemas.UserBase, db: Session = Depends(get_db)):
    user = curd.get_user(db, user.email)
    return {"result": bool(user)}


@app.post("/auth/register", response_model=schemas.User)
def register_user(user: schemas.UserCreate, db: Session = Depends(get_db)):
    if curd.get_user(db, email=user.email):
        raise HTTPException(status_code=400, detail="The given email id is already in use !")
    if not re.match(r"^[a-zA-Z0-9.!#$%&'*+/=?^_`{|}~-]+@[a-zA-Z0-9-]+(?:\.[a-zA-Z0-9-]+)*$", user.email):
        raise HTTPException(status_code=400, detail="The given email id is invalid")
    if not (MIN_OBJECTS <= len(user.objects) <= MAX_OBJECTS):
        raise HTTPException(
            status_code=400,
            detail=f"A NeoPass must contain between {MIN_OBJECTS} and {MAX_OBJECTS} objects",
        )
    if len(set(obj.uid for obj in user.objects)) != len(user.objects):
        raise HTTPException(status_code=400, detail="NeoPass objects must be distinct")
    if not all(curd.get_object(db, object.uid) for object in user.objects):
        raise HTTPException(status_code=400, detail="Invalid objects were found.")

    return curd.create_user(db, user)


@app.get("/object/all", response_model=schemas.ObjectList)
def get_objects(db: Session = Depends(get_db)):
    return {"objects": curd.get_all_objects(db)}


@app.get("/object/{uid}")
def get_object_image(uid: str, db: Session = Depends(get_db)):
    obj = curd.get_object(db, uid)
    if obj:
        return FileResponse(OBJECTS_SVG_DIR + obj.file)
    raise HTTPException(status_code=404, detail="Invalid object requested !")


@app.get("/image/{uid}")
def get_image_file(uid: str, db: Session = Depends(get_db)):
    image = curd.get_image(db, uid)
    if image:
        return FileResponse(IMAGES_DIR + image.file)
    raise HTTPException(status_code=404, detail="Invalid Image requested !")


@app.get("/user/info", response_model=schemas.User)
async def get_user_info(user: models.User = Depends(get_current_user)):
    return user


# --- Research metrics (proposal section 6.1) ---

@app.post("/metrics")
def record_metric(metric: schemas.MetricIn, db: Session = Depends(get_db)):
    curd.record_metric(db, metric)
    return {"result": "ok"}


@app.get("/metrics/export")
def export_metrics(authorization: str = Header(default=""), db: Session = Depends(get_db)):
    if not METRICS_TOKEN:
        raise HTTPException(status_code=404, detail="Metrics export is not enabled")
    if authorization != f"Bearer {METRICS_TOKEN}":
        raise HTTPException(status_code=401, detail="Invalid metrics token")
    return {
        "events": [
            {
                "id": e.id,
                "session": e.session,
                "event": e.event,
                "value_ms": e.value_ms,
                "meta": e.meta,
                "created": e.created.isoformat(),
            }
            for e in curd.get_metrics(db)
        ]
    }
