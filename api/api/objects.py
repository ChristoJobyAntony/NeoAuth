import os
from typing import List
from uuid import uuid4

from sqlalchemy.orm import Session

from . import models
from .config import OBJECTS_SVG_DIR


def getObjectsFromFile(base: str = OBJECTS_SVG_DIR) -> List[str]:
    assets: List[str] = []
    for (_, _, files) in os.walk(base):
        for file in files:
            if os.path.splitext(file)[-1] == ".svg":
                assets.append(file)
    return assets


def uploadObjects(db: Session):
    for object in getObjectsFromFile():
        if not db.query(models.Object).filter(models.Object.file == object).first():
            object = models.Object(uid=uuid4().hex, file=object, name=os.path.splitext(object)[0])
            db.add(object)
    db.commit()
    db.close()


if __name__ == "__main__":
    from .database import engine, get_db, wait_for_db

    wait_for_db()
    models.Base.metadata.create_all(engine)
    uploadObjects(next(get_db()))
