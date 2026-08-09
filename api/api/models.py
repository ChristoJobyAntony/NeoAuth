from sqlalchemy import Boolean, Column, DateTime, ForeignKey, Integer, String, Table, Text
from sqlalchemy.orm import relationship

from .database import Base


class User(Base):
    __tablename__ = "users"
    email = Column(String(length=50), primary_key=True)
    name = Column(String(length=50), nullable=False)
    # Argon2id hash string (includes its own random salt and parameters).
    secret = Column(String(length=200), nullable=False)


object_image_association_table = Table(
    'object_image_association',
    Base.metadata,
    Column('image_uid', ForeignKey('images.uid')),
    Column('object_uid', ForeignKey('objects.uid'))
)


class Object(Base):
    __tablename__ = "objects"
    uid = Column(String(length=36), primary_key=True)
    name = Column(String(length=20), unique=True, nullable=False)
    file = Column(String(length=100), nullable=False)


class ImageSet(Base):
    __tablename__ = "image_sets"
    uid = Column(String(length=36), primary_key=True)
    attempts = Column(Integer, default=0, nullable=False)

    images = relationship("Image", cascade="all, delete-orphan", back_populates="image_set")


class Image(Base):
    __tablename__ = "images"
    uid = Column(String(length=36), primary_key=True)
    set_id = Column(String(length=36), ForeignKey("image_sets.uid"), nullable=False)
    file = Column(String(length=36), nullable=False)

    image_set = relationship("ImageSet", back_populates="images")
    objects = relationship("Object", secondary=object_image_association_table)


class Challenge(Base):
    """A single-use, short-lived authentication challenge: an ordered list of
    image-set uids bound to one account. Burned on the first token attempt."""
    __tablename__ = "challenges"
    uid = Column(String(length=36), primary_key=True)
    email = Column(String(length=50), nullable=False)
    # JSON-encoded ordered list of image-set uids.
    set_uids = Column(Text, nullable=False)
    used = Column(Boolean, default=False, nullable=False)
    expires = Column(DateTime, nullable=False)


class MetricEvent(Base):
    """Anonymous research-evaluation telemetry (see proposal section 6.1)."""
    __tablename__ = "metric_events"
    id = Column(Integer, primary_key=True, autoincrement=True)
    session = Column(String(length=36), nullable=False)
    event = Column(String(length=50), nullable=False)
    value_ms = Column(Integer, nullable=True)
    meta = Column(Text, nullable=True)
    created = Column(DateTime, nullable=False)
