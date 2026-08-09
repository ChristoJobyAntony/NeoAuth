import os

# Directory containing the object SVGs (committed) and generated images (volume).
OBJECTS_SVG_DIR = os.getenv("OBJECTS_DIR", "./objects/")
IMAGES_DIR = os.getenv("IMAGES_DIR", "./images/")

# --- Scheme parameters (see COMP4500 research proposal, section 4.1) ---
# NeoPass: an ordered sequence of 6-8 secret objects.
MIN_OBJECTS = int(os.getenv("MIN_OBJECTS", "6"))
MAX_OBJECTS = int(os.getenv("MAX_OBJECTS", "8"))
# Image sets are DIMENSION^2 images partitioning the full object pool, so with
# 48 objects each image carries exactly 3 objects (paper: >= 3 per image).
DIMENSION = 4
# A challenge carries MAX_OBJECTS image-sets so any NeoPass length can answer.
CHALLENGE_SIZE = MAX_OBJECTS
# Challenges are single-use and short-lived (replay defence).
CHALLENGE_TTL_MINUTES = int(os.getenv("CHALLENGE_TTL_MINUTES", "5"))
# Image sets are retired after this many authentication attempts have used them.
MAX_ATTEMPTS = int(os.getenv("MAX_ATTEMPTS", "20"))
# Keep at least this many usable image sets pre-generated.
IMAGE_SET_POOL = int(os.getenv("IMAGE_SET_POOL", "12"))

JWT_SECRET_KEY = os.getenv("JWT_SECRET_KEY")
JWT_ALGORITHM = "HS256"
TOKEN_VALIDITY_TIME = 30  # minutes

# Server-side pepper: a leaked database cannot be cracked without this key,
# which lives only in the environment (never in the DB).
HASH_PEPPER = os.getenv("HASH_PEPPER")

# Optional bearer token protecting the research-metrics export endpoint.
METRICS_TOKEN = os.getenv("METRICS_TOKEN")

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
if not HASH_PEPPER:
    raise RuntimeError(
        "HASH_PEPPER is not set. Generate one with `openssl rand -hex 32` "
        "and provide it via the environment."
    )

os.makedirs(IMAGES_DIR, exist_ok=True)
