import hashlib
import os
from typing import List
from sqlalchemy.orm import Session

from . import models, schemas, images, auth
from .database import engine, get_db
from .config import *


def get_user (db : Session, email : str ) : 
    return db.query(models.User).filter(models.User.email == email).first()

def create_user (db  :Session, user : schemas.UserCreate) : 
    uid = [obj.uid for obj in user.objects ]
    user = models.User(email=user.email, name=user.name, secret=auth.get_password_hash(user.email, uid))
    db.add(user)
    db.commit()
    db.refresh(user)
    return user

def get_all_objects (db : Session) : 
    return db.query(models.Object).all()

def get_object (db: Session, uid: str) :
    return db.query(models.Object).filter(models.Object.uid == uid).first()

def get_image(db: Session, uid : str) :
    return db.query(models.Image).filter(models.Image.uid == uid).first()

def get_image_set (db: Session, imageSet : models.ImageSet) : 
    return db.query(models.ImageSet).filter(models.ImageSet.uid == imageSet.uid).first()
    
async def remove_image_set(db: Session, imageSet : models.ImageSet) : 
    imgs = db.query(models.ImageSet).filter(models.ImageSet.uid == imageSet.uid).first().images
    images.removeImages(imgs)
    db.delete(imageSet)
    db.commit()

def get_image_sets (db : Session, exclude : List[schemas.BaseImageSet]) -> None | List[models.ImageSet]:
    exclude = [imgSet.uid  for imgSet in exclude]
    imgSets = db.query(models.ImageSet).filter(models.ImageSet.uid.notin_(exclude)).all()
    for imgSet in imgSets :
        if imgSet.attempts >= MAX_ATTEMPTS : 
            remove_image_set(db, imgSet)
            imgSets.remove(imgSet)
    return imgSets

async def increment_attempt (db : Session, imageSet : models.ImageSet) : 
    imageSet  = db.query(models.ImageSet).filter(models.ImageSet.uid == imageSet.uid).first()
    imageSet.attempts += 1
    db.commit()

if __name__ == "__main__" : 
    from .images import imageSetGenerator
    models.Base.metadata.create_all(engine)
    db = get_db().__next__()
    i = imageSetGenerator(db, 16)
    i = get_image_set(db, i)
    # remove_image_set(db, i, "./API/images/")
    db.close()



