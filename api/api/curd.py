import json
import random
from datetime import datetime, timedelta
from typing import List, Optional
from uuid import uuid4

from sqlalchemy.orm import Session

from . import auth, images, models, schemas
from .config import CHALLENGE_SIZE, CHALLENGE_TTL_MINUTES, MAX_ATTEMPTS


def get_user(db: Session, email: str):
    return db.query(models.User).filter(models.User.email == email).first()


def create_user(db: Session, user: schemas.UserCreate):
    uid = [obj.uid for obj in user.objects]
    user = models.User(email=user.email, name=user.name, secret=auth.hash_neopass(user.email, uid))
    db.add(user)
    db.commit()
    db.refresh(user)
    return user


def get_all_objects(db: Session):
    return db.query(models.Object).all()


def get_object(db: Session, uid: str):
    return db.query(models.Object).filter(models.Object.uid == uid).first()


def get_image(db: Session, uid: str):
    return db.query(models.Image).filter(models.Image.uid == uid).first()


def get_image_set(db: Session, uid: str) -> Optional[models.ImageSet]:
    return db.query(models.ImageSet).filter(models.ImageSet.uid == uid).first()


def remove_image_set(db: Session, imageSet: models.ImageSet):
    images.removeImages(imageSet.images)
    db.delete(imageSet)
    db.commit()


def get_usable_image_sets(db: Session) -> List[models.ImageSet]:
    """Return image sets still fit for use, retiring worn-out ones."""
    imgSets = db.query(models.ImageSet).all()
    fresh = []
    for imgSet in imgSets:
        if imgSet.attempts >= MAX_ATTEMPTS:
            remove_image_set(db, imgSet)
        else:
            fresh.append(imgSet)
    return fresh


def ensure_image_set_pool(db: Session, minimum: int) -> List[models.ImageSet]:
    """Top the pool of usable image sets up to `minimum`, generating as needed."""
    pool = get_usable_image_sets(db)
    while len(pool) < minimum:
        pool.append(images.imageSetGenerator(db))
    return pool


def increment_attempt(db: Session, imageSet: models.ImageSet):
    imageSet = db.query(models.ImageSet).filter(models.ImageSet.uid == imageSet.uid).first()
    if imageSet:
        imageSet.attempts += 1
    db.commit()


# --- Single-use authentication challenges ---

def create_challenge(db: Session, email: str) -> models.Challenge:
    pool = ensure_image_set_pool(db, CHALLENGE_SIZE)
    chosen = random.sample(pool, CHALLENGE_SIZE)
    challenge = models.Challenge(
        uid=uuid4().hex,
        email=email,
        set_uids=json.dumps([s.uid for s in chosen]),
        used=False,
        expires=datetime.utcnow() + timedelta(minutes=CHALLENGE_TTL_MINUTES),
    )
    db.add(challenge)
    db.commit()
    db.refresh(challenge)
    return challenge


def get_challenge(db: Session, uid: str) -> Optional[models.Challenge]:
    return db.query(models.Challenge).filter(models.Challenge.uid == uid).first()


def consume_challenge(db: Session, challenge: models.Challenge) -> bool:
    """Atomically burn the challenge; returns False if it was already used
    or has expired."""
    if challenge.used or challenge.expires < datetime.utcnow():
        return False
    challenge.used = True
    db.commit()
    return True


def purge_expired_challenges(db: Session):
    db.query(models.Challenge).filter(models.Challenge.expires < datetime.utcnow()).delete()
    db.commit()


# --- Research metrics ---

def record_metric(db: Session, metric: schemas.MetricIn):
    event = models.MetricEvent(
        session=metric.session,
        event=metric.event,
        value_ms=metric.value_ms,
        meta=metric.meta,
        created=datetime.utcnow(),
    )
    db.add(event)
    db.commit()


def get_metrics(db: Session) -> List[models.MetricEvent]:
    return db.query(models.MetricEvent).order_by(models.MetricEvent.id).all()
