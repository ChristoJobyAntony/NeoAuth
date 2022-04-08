# NeoAuth

A graphical authentication system based on cognimetrics, that is built on the principle of using arbitrary objects instead of images as the "pass-phrase".

## Experince The App 
The app is currently active on  -> `http://christojobyantony.zapto.org:4001/auth`

## The Stack 
This implementation of NeoAuth is built on 
1. API -> Fast API Python 
2. ORM -> SQLAlchemy
3. Server -> MariaDB (Or any other SQL alternative)
4. Frontend -> React Typescript

## API - Setup
1. The API dependencies can be installed using poetry  `poetry install`
2. Add at least 32 objects (SVG files) to the directory `/api/objects/`
3. The objects then need to be uploaded to the DB using the command  > python -m api.object
4. Store your database credentials under `/api/secrets/mysql_config.txt` in the format -> `<username>:<password>:<database>`
5. Generate a JWT secret key and store it under `/api/secrets/jwt_key.txt`
6. Now u can run the API by, `python main.py`

## Frontend - Setup
1. Install all the dependencies using `npm install`.
2. Update the api.tsx located in `/app/src/api.tsx` to specify API network address.
3. The app is ready run `npm start`

## The Concept 
### NeoPass
Composes of 4 - 8 arbiatry objects of user choices.
### Objects
An object is the image of an arbitrary and recognisable singular entity, like a car, apple, etc.
### Image
An Image is a collection of multiple objects randomly composited together using Python.
### ImageSet
Image Set is a collection of 16 images that represent a single challenge. An image set will consist of all the objects.
### Challenge
The challenge is a collection of 4 or more image sets. From which the user is required to select his objects.


