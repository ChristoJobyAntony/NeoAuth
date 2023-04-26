from typing import List
from uuid import UUID, uuid4
from sqlalchemy.orm import Session
import os

from .database import engine, get_db
from . import models, curd
from .config import *

def getObjectsFromFile (base : str = OBJECTS_SVG_DIR) -> List[str] :
    assets : List[str] = [] 
    for (_, _, files) in os.walk(base) : 
        for file in files : 
            if os.path.splitext(file)[-1] == ".svg" : assets.append(file)
    return assets

def uploadObjects (db : Session) : 
    for object in getObjectsFromFile() : 
        if not db.query(models.Object).filter(models.Object.file == object).first() : 
            object = models.Object(uid = uuid4().hex, file=object, name=os.path.splitext(object)[0])
            db.add(object)
    db.commit()
    db.close()
    
if __name__ == "__main__" : 
    models.Base.metadata.create_all(engine)
    uploadObjects(get_db().__next__())
        
        

