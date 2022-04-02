import math
import os
from typing import Dict, List, Tuple
from sqlalchemy.orm import Session
from uuid import uuid4
import svgmanip as sm
import random
from cairosvg import svg2png

from .database import get_db, SessionLocal, engine
from . import  models
from .config import *

WIDTH = 200


def imageCreator(save_path: str, *files: str) -> str :
    objects_per_image = len(files)
    objs = []
    dimension = math.ceil(math.sqrt(objects_per_image))
    object_width = WIDTH / dimension

    for file in files :
        obj = sm.Element(file)
        scaleFactor = object_width / obj.width
        obj.scale(scaleFactor)
        obj.rotate(random.random() * 360)
        objs.append(obj)


    positions : List[Tuple[int, int]] = []
    for i in range(dimension) :
        for j in range(dimension) : 
            positions.append((i * object_width, j * object_width))

    base = sm.Element(WIDTH, WIDTH)
    for obj in objs : 
        pos = random.choice(positions)
        positions.remove(pos)
        x, y = pos
        base.placeat(obj, x, y)    
      
    svg2png(bytestring=base.tostr(), background_color="white", parent_height=200, parent_width=200, write_to=save_path )

def imageSetGenerator (db : Session) -> models.ImageSet:
    images = DIMENSION ** 2
    counter = images
    objects = db.query(models.Object).all()
    imageSet = models.ImageSet(uid=uuid4().hex)
    db.add(imageSet)
    while (counter > 0) : 
        objects_per_image = len(objects) // counter
        current_objects = random.sample(objects, objects_per_image)
        for obj in current_objects : objects.remove(obj)

        current_objects_path = [OBJECTS_SVG_DIR + obj.file for obj in current_objects]
        uid = uuid4().hex
        file = uid + ".png"
        imageCreator(IMAGES_DIR + file, *current_objects_path)
        image = models.Image(uid=uid, file=file, set_id=imageSet.uid, objects=current_objects)
        db.add(image)
        counter -= 1 
    db.commit()
    db.refresh(imageSet)
    return imageSet

def removeImages (images : List[models.Image]) :
    for image in images : 
        print(IMAGES_DIR + image.file)
        os.remove(IMAGES_DIR + image.file)


if __name__ == "__main__" : 
    models.Base.metadata.create_all(engine)
    db = get_db().__next__()
    img = imageSetGenerator(db, 16) 
    db.delete(img)
    db.commit()
    db.close()








