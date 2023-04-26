from sqlalchemy import Column, String, Integer, Table, Text, ForeignKey, LargeBinary
from sqlalchemy.orm import relationship


from .database import Base

class User (Base) : 
    __tablename__ = "users"
    email = Column(String(length=50), primary_key=True)
    name = Column(String(length=50), nullable=False)
    secret = Column(String(length=64), nullable=False)

object_image_association_table = Table(
    'object_image_association',
    Base.metadata,
    Column('image_uid', ForeignKey('images.uid')),
    Column('object_uid', ForeignKey('objects.uid'))
)

class Object (Base) :
    __tablename__ = "objects"
    uid = Column(String(length=36), primary_key=True)
    name = Column(String(length=20), unique=True, nullable=False)
    file = Column(String(length=100), nullable=False)

class ImageSet (Base) : 
    __tablename__ = "image_sets"
    uid = Column(String(length=36), primary_key=True)
    attempts = Column(Integer, default=0, nullable=False)   

    # Define teh relationsip to allow object-oriented method of accessing relationships.
    # back_populates allows us to access the relationship in reverse
    images = relationship("Image", cascade="all, delete-orphan", back_populates="image_set")


class Image (Base) : 
    __tablename__ = "images"
    uid = Column(String(length=36), primary_key=True)
    set_id = Column(String(length=36), ForeignKey("image_sets.uid"), nullable=False)
    file = Column(String(length=36), nullable=False)

    image_set = relationship("ImageSet", back_populates="images")
    objects = relationship("Object", secondary=object_image_association_table)

