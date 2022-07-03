# node-email-verification

The main goal of app was to create an email account verification. The app contains user registration with email verification, login and route which allows resending verification email. Email verification is made with nodemailer (you can use gmail smtp or gmail oauth smtp -> check out in config folder) and jsonwebtoken (jwt). The rest of important modules: mongoose, connect-mongo, bcrypt, passport, passport-local, express, express-session.

## Setup

To run this project, make following steps :

```
$ npm install
```

Create .env file and variables in it: 'PORT', 'BASE_URL', 'MONGODB_URL', 'SESSION_SECRET', 'TOKEN_MAIL_VERIFICATION_SECRET', 'CLIENT_EMAIL', 'CLIENT_ID', 'CLIENT_SECRET', 'REDIRECT_URI', 'REFRESH_TOKEN', 'USER_EMAIL', 'USER_PASSWORD'
example:

```
PORT = 3000
BASE_URL = "http://localhost:3000/"
MONGODB_URL = "mongodb+srv://..."
SESSION_SECRET = "seccretttt"
#for gmail oauth smtp
CLIENT_EMAIL = "user@gmail.com"
CLIENT_ID = "1234"
CLIENT_SECRET = "secret"
REDIRECT_URI = "https://developers.google.com/oauthplayground"
REFRESH_TOKEN = "refreshtoken"
TOKEN_MAIL_VERIFICATION_SECRET = "seccretttt"
#for gmail smtp
USER_EMAIL = "user@gmail.com"
USER_PASSWORD = "password"
```

And finally:

```
$ npm run start
```

## Helpful links

https://stackoverflow.com/a/51933602/17552127 (gmail oauth smtp)
https://stackoverflow.com/a/45479968/17552127 (gmail smtp)
