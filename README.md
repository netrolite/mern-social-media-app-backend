# MERN social media app backend

## Getting started:
1. Run `git clone https://github.com/empflow/mern-social-media-app-backend.git` to clone the repo
1. Run `npm i` to install all dependencies
1. Create a file named `.env` in the root of the project
1. Add the following variables inside the `.env` file (I've provided defaults for some of them):

```
DEV_MONGO_URL=mongodb://localhost:27017
PROD_MONGO_URL=mongodb://localhost:27017

JWT_SECRET=
JWT_EXPIRES_IN='30d'

The default avatar url used if the user hasn't uploaded one
DEFAULT_AVATAR_URL_400_PX='https://vk.com/images/camera_400.png'
DEFAULT_AVATAR_URL_200_PX='https://vk.com/images/camera_200.png'
DEFAULT_AVATAR_URL_100_PX='https://vk.com/images/camera_100.png'

Your S3 provider should give you this information
S3_BUCKET_NAME=
S3_REGION=
S3_ENDPOINT=
S3_ACCESS_KEY_ID=
S3_SECRET_ACCESS_KEY=
```
