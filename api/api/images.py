import math
import os
import random
import xml.etree.ElementTree as ET
from typing import List
from uuid import uuid4

from cairosvg import svg2png
from sqlalchemy.orm import Session

from . import models
from .config import DIMENSION, IMAGES_DIR, OBJECTS_SVG_DIR

WIDTH = 200

SVG_NS = "http://www.w3.org/2000/svg"
ET.register_namespace("", SVG_NS)


def _load_object_svg(path: str) -> ET.Element:
    """Load an object SVG and make sure it has a viewBox so it can be nested."""
    inner = ET.parse(path).getroot()
    if inner.get("viewBox") is None:
        width = inner.get("width")
        height = inner.get("height")
        if not (width and height):
            raise ValueError(f"SVG {path} has neither viewBox nor width/height")
        inner.set("viewBox", f"0 0 {float(width)} {float(height)}")
    return inner


def imageCreator(save_path: str, *files: str) -> None:
    """Composite the given object SVGs onto one square image, in random cells
    with random rotation, and rasterise it to a PNG."""
    dimension = math.ceil(math.sqrt(len(files)))
    cell = WIDTH / dimension

    root = ET.Element(
        f"{{{SVG_NS}}}svg",
        {"width": str(WIDTH), "height": str(WIDTH), "viewBox": f"0 0 {WIDTH} {WIDTH}"},
    )
    positions = [(i * cell, j * cell) for i in range(dimension) for j in range(dimension)]

    # Inset each object within its cell so rotation never clips it at the
    # image border.
    inset = cell * 0.1
    size = cell * 0.8

    for file in files:
        inner = _load_object_svg(file)
        inner.set("x", str(inset))
        inner.set("y", str(inset))
        inner.set("width", str(size))
        inner.set("height", str(size))

        x, y = random.choice(positions)
        positions.remove((x, y))
        angle = random.random() * 360
        group = ET.SubElement(
            root,
            f"{{{SVG_NS}}}g",
            {"transform": f"translate({x} {y}) rotate({angle} {cell / 2} {cell / 2})"},
        )
        group.append(inner)

    svg2png(
        bytestring=ET.tostring(root),
        background_color="white",
        output_width=WIDTH,
        output_height=WIDTH,
        write_to=save_path,
    )


def imageSetGenerator(db: Session) -> models.ImageSet:
    counter = DIMENSION ** 2
    objects = db.query(models.Object).all()
    imageSet = models.ImageSet(uid=uuid4().hex)
    db.add(imageSet)
    while counter > 0:
        objects_per_image = len(objects) // counter
        current_objects = random.sample(objects, objects_per_image)
        for obj in current_objects:
            objects.remove(obj)

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


def removeImages(images: List[models.Image]) -> None:
    for image in images:
        try:
            os.remove(IMAGES_DIR + image.file)
        except FileNotFoundError:
            pass
