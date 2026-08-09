import hashlib
import hmac
import itertools
from datetime import datetime, timedelta, timezone
from typing import List, Optional

import jwt
from argon2 import PasswordHasher
from argon2.exceptions import VerifyMismatchError
from fastapi.security import OAuth2PasswordBearer

from . import models, schemas
from .config import HASH_PEPPER, JWT_ALGORITHM, JWT_SECRET_KEY, TOKEN_VALIDITY_TIME

oauth2_scheme = OAuth2PasswordBearer(tokenUrl="auth/token")

# Verification hashes every candidate object sequence from the response images
# (up to 3^8 candidates), so Argon2id is tuned modest; the HMAC pepper is what
# makes a leaked database uncrackable without the server environment.
password_hasher = PasswordHasher(time_cost=1, memory_cost=4096, parallelism=1)


def _candidate_string(email: str, objects_uid: List[str]) -> str:
    """Peppered HMAC over the ordered object uids bound to the account."""
    message = "&".join(objects_uid) + email
    return hmac.new(HASH_PEPPER.encode(), message.encode(), hashlib.sha256).hexdigest()


def hash_neopass(email: str, objects_uid: List[str]) -> str:
    return password_hasher.hash(_candidate_string(email, objects_uid))


def authenticate_user(user: models.User, images: List[models.Image]) -> bool:
    object_set = [[obj.uid for obj in image.objects] for image in images]
    for possibility in itertools.product(*object_set):
        try:
            password_hasher.verify(user.secret, _candidate_string(user.email, list(possibility)))
            return True
        except VerifyMismatchError:
            continue
    return False


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
