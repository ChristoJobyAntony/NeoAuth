from typing import List

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


class Token(BaseModel):
    access_token: str
    token_type: str


class UserBase(BaseModel):
    email: str


class UserCreate(UserBase):
    objects: List[ObjectBase]
    name: str


class UserAuth(UserBase):
    images: List[Image]


class User(UserBase):
    model_config = ConfigDict(from_attributes=True)

    name: str


class ImageSetGet(BaseModel):
    exclude_uid: List[BaseImageSet]
    user: User
