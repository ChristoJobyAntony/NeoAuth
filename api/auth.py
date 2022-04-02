
import hashlib
import itertools
from datetime import datetime, timedelta
from typing import List
from fastapi import Depends, HTTPException, status
from fastapi.security import OAuth2PasswordBearer
from jose import jwt, JWTError

from .config import *
from . import schemas, models

oauth2_scheme = OAuth2PasswordBearer(tokenUrl="auth/token")

def authenticate_user (user: models.User, images : List[models.Image]) : 
    object_set = [[obj.uid  for obj in image.objects] for image in images ]
    product_object_set = itertools.product(*object_set)
    for possibility in product_object_set :
        if get_password_hash(user.email, possibility) == user.secret : 
            return True
    return False

def get_password_hash (email : str, objects_uid : List[str]):
    secretString = "&".join(objects_uid) + email
    return hashlib.sha256(secretString.encode("utf8")).hexdigest()

def create_access_token (data : schemas.User) :
    to_encode = {
        "email" : data.email,
        "exp" : datetime.utcnow() + timedelta(minutes=TOKEN_VALIDITY_TIME   )
        }
    return jwt.encode(to_encode, JWT_SECRET_KEY, algorithm=JWT_ALGORITHM )

def get_email_from_token (token: str = Depends(oauth2_scheme)): 
    try:
        payload = jwt.decode(token, JWT_SECRET_KEY, algorithms=[JWT_ALGORITHM])
        email: str = payload.get("email")
        if  email : return email
    except JWTError:
        return None






    
