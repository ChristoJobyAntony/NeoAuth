from typing import List, Optional

from pydantic import BaseModel, ConfigDict


class ObjectBase(BaseModel):
    uid: str


class Object(ObjectBase):
    model_config = ConfigDict(from_attributes=True)

    name: str


class ObjectList(BaseModel):
    objects: List[Object]


class Image(BaseModel):
    model_config = ConfigDict(from_attributes=True)

    uid: str


class BaseImageSet(BaseModel):
    uid: str


class ImageSet(BaseImageSet):
    model_config = ConfigDict(from_attributes=True)

    images: List[Image]


class Challenge(BaseModel):
    """A single-use authentication challenge: ordered image-sets, one secret
    object to be found per set."""
    uid: str
    image_sets: List[ImageSet]


class Token(BaseModel):
    access_token: str
    token_type: str


class UserBase(BaseModel):
    email: str


class UserCreate(UserBase):
    objects: List[ObjectBase]
    name: str


class User(UserBase):
    model_config = ConfigDict(from_attributes=True)

    name: str


class MetricIn(BaseModel):
    session: str
    event: str
    value_ms: Optional[int] = None
    meta: Optional[str] = None
