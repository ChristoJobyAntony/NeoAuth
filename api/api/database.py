from sqlalchemy import create_engine
import sqlalchemy
from sqlalchemy.ext.declarative import declarative_base
from sqlalchemy.orm import sessionmaker

from .config import *

engine = sqlalchemy.create_engine(
    f"mariadb+mariadbconnector://{DB_USER}:{DB_PASSWORD}@neoauth-db:{DB_PORT}/{DB_NAME}",
    pool_pre_ping=True)

SessionLocal = sessionmaker(autocommit=False, autoflush=False, bind=engine)

Base = declarative_base()

def get_db () : 
    db = SessionLocal()
    try : 
        yield db
    finally :
        db.close()

