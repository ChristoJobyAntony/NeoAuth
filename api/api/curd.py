from typing import List

from sqlalchemy.orm import Session

from . import auth, images, models, schemas
from .config import MAX_ATTEMPTS


def get_user(db: Session, email: str):
    return db.query(models.User).filter(models.User.email == email).first()


def create_user(db: Session, user: schemas.UserCreate):
    uid = [obj.uid for obj in user.objects]
    user = models.User(email=user.email, name=user.name, secret=auth.get_password_hash(user.email, uid))
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


def get_image_set(db: Session, imageSet: models.ImageSet):
    return db.query(models.ImageSet).filter(models.ImageSet.uid == imageSet.uid).first()


def remove_image_set(db: Session, imageSet: models.ImageSet):
    images.removeImages(imageSet.images)
    db.delete(imageSet)
    db.commit()


def get_image_sets(db: Session, exclude: List[schemas.BaseImageSet]) -> List[models.ImageSet]:
    exclude_uids = [imgSet.uid for imgSet in exclude]
    imgSets = db.query(models.ImageSet).filter(models.ImageSet.uid.notin_(exclude_uids)).all()
    fresh = []
    for imgSet in imgSets:
        if imgSet.attempts >= MAX_ATTEMPTS:
            remove_image_set(db, imgSet)
        else:
            fresh.append(imgSet)
    return fresh


def increment_attempt(db: Session, imageSet: models.ImageSet):
    imageSet = db.query(models.ImageSet).filter(models.ImageSet.uid == imageSet.uid).first()
    imageSet.attempts += 1
    db.commit()
