from hashlib import sha256
from typing import List
import itertools
from fastapi import FastAPI, Depends, HTTPException, status
from fastapi.responses import FileResponse
from fastapi.middleware.cors import CORSMiddleware
from fastapi.security import OAuth2PasswordRequestForm
from sqlalchemy.orm import Session
import re
import random

from . import models, curd, schemas, auth
from .database import engine, get_db
from .images import imageSetGenerator
from .objects import uploadObjects
from .config import *

models.Base.metadata.create_all(engine)

app = FastAPI()
# Image Configs

origins = [
    "http://localhost:3000",
    "http://christojobyantony.zapto.org:4001",
]

app.add_middleware(
    CORSMiddleware,
    allow_origins=origins,
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"]
)

# OAuth2 Dependency
async def get_current_user(token: str = Depends(auth.oauth2_scheme), db : Session = Depends(get_db)):
    credentials_exception = HTTPException(
        status_code=status.HTTP_401_UNAUTHORIZED,
        detail="Could not validate credentials",
        headers={"WWW-Authenticate": "Bearer"},
    )
    email = auth.get_email_from_token(token)
    user = curd.get_user(db, email)
    if user is None:
        raise credentials_exception
    return user

@app.get("/")
async def root () :
    return { "message" : "Hello World from Neo Auth API"}

@app.post("/auth/login")
async def login ( attempt : schemas.UserAuth, db : Session = Depends(get_db)) :
    # verify all images are valid 
    images = [ curd.get_image(db, img.uid) for img in attempt.images] 
    if not all(images) : raise HTTPException(status_code=400, detail="The given images are not valid")
    # verify user is valid
    user = curd.get_user(db, attempt.email)
    if not user : raise HTTPException(status_code=400, detail="Invalid credentails ")

    # Now attempt to test the hash combinations.
    object_set = [[obj.uid  for obj in image.objects] for image in images ]
    product_object_set = itertools.product(*object_set)
    for possibility in product_object_set :
        secrect_hash = "&".join(possibility)+user.email
        secrect_hash = sha256(secrect_hash.encode("utf8")).hexdigest()
        if secrect_hash == user.secret : return {"message" : "login successful"}
    
    raise HTTPException(status_code=400, detail="Invalid Credentials")

@app.post("/auth/token", response_model=schemas.Token)
async def tokenAuth (form : OAuth2PasswordRequestForm = Depends(), db : Session = Depends(get_db)) :
    print(form.password)
    images = form.password.split("-")
    print(images)
    # verify all images are valid 
    images = [ curd.get_image(db, img) for img in images] 
    if not all(images) : raise HTTPException(status_code=400, detail="The given images are not valid")
    # verify user is valid
    user = curd.get_user(db, form.username)
    if not user : raise HTTPException(status_code=400, detail="Invalid email")

    # Increment the attempts
    [ curd.increment_attempt(db, image.image_set)  for image in images]
    
    # Now attempt to test the hash combinations.
    if auth.authenticate_user(user, images) : return {"access_token" : auth.create_access_token(user), "token_type": "bearer"}
    
    raise HTTPException(status_code=400, detail="Invalid Credentials")

@app.post("/auth/register/email")
async def validEmail (user : schemas.UserBase, db:Session = Depends(get_db)) : 
    user = curd.get_user(db, user.email)
    return {"result" : bool(user)}

@app.post("/auth/register", response_model=schemas.User)
async def register (user : schemas.UserCreate, db:Session = Depends(get_db)) :
    if  curd.get_user(db, email=user.email) : 
        raise HTTPException(status_code=400, detail="The given email id is already in use !")
    if  not re.match("^[a-zA-Z0-9.!#$%&'*+/=?^_`{|}~-]+@[a-zA-Z0-9-]+(?:\.[a-zA-Z0-9-]+)*$", user.email):
        raise HTTPException(status_code=400, detail= "The given email id is invalid")
    if not all([curd.get_object(db, object.uid)  for object in user.objects ]) : 
        raise HTTPException(status_code=400, detail="Invalid objects were found.")
    
    return curd.create_user(db, user)
    
@app.get ("/object/all", response_model=schemas.ObjectList)
async def getObjects (db:Session = Depends(get_db)) :
    return {"objects" : curd.get_all_objects(db)}

@app.get("/object/{uid}")
async def getObject (uid: str, db:Session = Depends(get_db) ):
    obj = curd.get_object(db, uid)
    if obj :   return FileResponse(OBJECTS_SVG_DIR + obj.file)
    else : raise HTTPException(400, "Invalid object requested !")


@app.post("/image/set", response_model=schemas.ImageSet) 
async def getImageSet (user: schemas.UserBase, exclude: List[schemas.BaseImageSet] = [],  db:Session = Depends(get_db)) : 
    if not curd.get_user(db, user.email) : raise HTTPException(400, detail="Invalid email id produced for verification")

    imageSets = curd.get_image_sets(db, exclude)
    imageSets.append(None)
    choice =  random.choice(imageSets)
    if choice : 
        img_set = curd.get_image_set(db, choice)
    else :
        img_set =  imageSetGenerator(db)
    
    return img_set

@app.get("/image/{uid}")
async def getImage( uid: str, db:Session = Depends(get_db)) : 
    image = curd.get_image(db, uid)
    if image : return FileResponse(IMAGES_DIR + image.file)
    else : raise HTTPException("Invalid Image requested !")

@app.get("/user/info", response_model=schemas.User)
async def getUserInfo( user : models.User = Depends(get_current_user)) : 
    return user
