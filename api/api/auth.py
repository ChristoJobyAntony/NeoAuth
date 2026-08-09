import hashlib
import itertools
from datetime import datetime, timedelta, timezone
from typing import List, Optional

import jwt
from fastapi.security import OAuth2PasswordBearer

from . import models, schemas
from .config import JWT_ALGORITHM, JWT_SECRET_KEY, TOKEN_VALIDITY_TIME

oauth2_scheme = OAuth2PasswordBearer(tokenUrl="auth/token")


def authenticate_user(user: models.User, images: List[models.Image]) -> bool:
    object_set = [[obj.uid for obj in image.objects] for image in images]
    for possibility in itertools.product(*object_set):
        if get_password_hash(user.email, possibility) == user.secret:
            return True
    return False


def get_password_hash(email: str, objects_uid: List[str]) -> str:
    secret_string = "&".join(objects_uid) + email
    return hashlib.sha256(secret_string.encode("utf8")).hexdigest()


def create_access_token(data: schemas.User) -> str:
    to_encode = {
        "email": data.email,
        "exp": datetime.now(timezone.utc) + timedelta(minutes=TOKEN_VALIDITY_TIME),
    }
    return jwt.encode(to_encode, JWT_SECRET_KEY, algorithm=JWT_ALGORITHM)


def get_email_from_token(token: str) -> Optional[str]:
    try:
        payload = jwt.decode(token, JWT_SECRET_KEY, algorithms=[JWT_ALGORITHM])
        return payload.get("email")
    except jwt.PyJWTError:
        return None
