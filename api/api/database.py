import logging
import time

from sqlalchemy import create_engine, text
from sqlalchemy.orm import declarative_base, sessionmaker

from .config import DB_HOST, DB_NAME, DB_PASSWORD, DB_PORT, DB_USER

logger = logging.getLogger(__name__)

engine = create_engine(
    f"mysql+pymysql://{DB_USER}:{DB_PASSWORD}@{DB_HOST}:{DB_PORT}/{DB_NAME}",
    pool_pre_ping=True,
)

SessionLocal = sessionmaker(autocommit=False, autoflush=False, bind=engine)

Base = declarative_base()


def wait_for_db(max_tries: int = 30, delay: float = 2.0) -> None:
    """Block until the database accepts connections (container start-up race)."""
    for attempt in range(1, max_tries + 1):
        try:
            with engine.connect() as conn:
                conn.execute(text("SELECT 1"))
            return
        except Exception:
            logger.warning("Database not ready (attempt %d/%d), retrying...", attempt, max_tries)
            time.sleep(delay)
    raise RuntimeError("Could not connect to the database")


def get_db():
    db = SessionLocal()
    try:
        yield db
    finally:
        db.close()
