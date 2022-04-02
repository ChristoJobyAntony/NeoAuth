from os import access
from typing import List
from pydantic import BaseModel

class ObjectBase (BaseModel) :
    uid : str

class Object(ObjectBase) :
    name : str

    class Config : 
        orm_mode = True

class ObjectList(BaseModel) : 
    objects : list[Object]

class Image (BaseModel) : 
    uid : str

    class Config : 
        orm_mode = True

class BaseImageSet (BaseModel) : 
    uid : str 

class ImageSet(BaseImageSet) :
    images : List[Image]
    class Config : 
        orm_mode = True

class Token (BaseModel) :
    access_token : str
    token_type : str
    
class UserBase (BaseModel) : 
    email : str

class UserCreate (UserBase) : 
    objects : List[ObjectBase]
    name : str

class UserAuth (UserBase) :
    images : List[Image]

class User (UserBase) : 
    name : str

    class Config : 
        orm_mode = True

class ImageSetGet (BaseModel) :
    exclude_uid : List[BaseImageSet]
    user : User