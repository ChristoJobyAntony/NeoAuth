
MAX_ATTEMPTS = 1000
DIMENSION = 4
IMAGES_DIR= "./api/images/"
OBJECTS_SVG_DIR = "./api/objects/"
JWT_SECRET_KEY = open("./api/secrets/jwt_key.txt").read()
DB_CREDENTIALS = "./api/secrets/mysql_config.txt"
JWT_ALGORITHM = "HS256"
TOKEN_VALIDITY_TIME = 30