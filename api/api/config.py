import os

# Directory containing the object SVGs (committed) and generated images (volume).
OBJECTS_SVG_DIR = os.getenv("OBJECTS_DIR", "./objects/")
IMAGES_DIR = os.getenv("IMAGES_DIR", "./images/")

MAX_ATTEMPTS = int(os.getenv("MAX_ATTEMPTS", "100"))
DIMENSION = 4

JWT_SECRET_KEY = os.getenv("JWT_SECRET_KEY")
JWT_ALGORITHM = "HS256"
TOKEN_VALIDITY_TIME = 30  # minutes

DB_USER = os.getenv("MYSQL_USER")
DB_PASSWORD = os.getenv("MYSQL_PASSWORD")
DB_HOST = os.getenv("MYSQL_HOST", "db")
DB_PORT = os.getenv("MYSQL_PORT", "3306")
DB_NAME = os.getenv("MYSQL_DATABASE")

CORS_ORIGINS = [
    origin.strip()
    for origin in os.getenv("CORS_ORIGINS", "http://localhost:3000,http://localhost:8080").split(",")
    if origin.strip()
]

if not JWT_SECRET_KEY:
    raise RuntimeError(
        "JWT_SECRET_KEY is not set. Generate one with `openssl rand -hex 32` "
        "and provide it via the environment."
    )

os.makedirs(IMAGES_DIR, exist_ok=True)
