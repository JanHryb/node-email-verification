const nodemailer = require("nodemailer");
const { google } = require("googleapis");
const OAuth2 = google.auth.OAuth2;
const jwt = require("jsonwebtoken");

const createTokenMailVerification = (id) => {
  const payload = {
    id: id,
  };
  const tokenMailVerification = jwt.sign(
    payload,
    process.env.TOKEN_MAIL_VERIFICATION_SECRET,
    { expiresIn: "1d" }
  );
  const url = process.env.BASE_URL + "mailverify?id=" + tokenMailVerification;
  return url;
};

const sendMail = async (email, firstName, id) => {
  const CLIENT_EMAIL = process.env.CLIENT_EMAIL;
  const CLIENT_ID = process.env.CLIENT_ID;
  const CLIENT_SECRET = process.env.CLIENT_SECRET;
  const REDIRECT_URI = process.env.REDIRECT_URI;
  const REFRESH_TOKEN = process.env.REFRESH_TOKEN;
  const OAuth2Client = new OAuth2(CLIENT_ID, CLIENT_SECRET, REDIRECT_URI);

  OAuth2Client.setCredentials({ refresh_token: REFRESH_TOKEN });
  try {
    const accessToken = await OAuth2Client.getAccessToken();

    const transporter = nodemailer.createTransport({
      service: "gmail",
      auth: {
        type: "OAuth2",
        user: CLIENT_EMAIL,
        clientId: CLIENT_ID,
        clientSecret: CLIENT_SECRET,
        refreshToken: REFRESH_TOKEN,
        accessToken: accessToken,
      },
    });
    const url = createTokenMailVerification(id);
    const mailOptions = {
      from: CLIENT_EMAIL,
      to: email,
      subject: "Account verification",
      html: `<!DOCTYPE html>
      <html lang="en">
      
      <head>
          <meta charset="UTF-8">
          <meta http-equiv="X-UA-Compatible" content="IE=edge">
          <meta name="viewport" content="width=device-width, initial-scale=1.0">
          <title>Document</title>
          <style>
              @import url('https://fonts.googleapis.com/css2?family=Roboto:wght@300;400&display=swap');
      
              * {
                  margin: 0;
                  padding: 0;
                  box-sizing: border-box;
                  word-wrap: break-word;
              }
      
              body {
                  font-family: "Roboto", sans-serif;
              }
      
              hr {
                  border-top: 1px solid #8c8b8b;
                  margin-top: 1em;
                  margin-bottom: 1em;
              }
      
              button {
                  padding: 1em;
                  border: none;
                  border-radius: 5px;
                  background-color: rgb(57, 103, 243);
                  text-decoration: none;
              }
              button>a {
                  font-size: 1.1em;
                  color: rgb(255, 255, 255) !important;
                  text-decoration: none;
              }
      
              p {
                  font-size: 1.1em;
              }
          </style>
      </head>
      
      <body>
          <h2>Hello ${firstName},</h2>
          <p>We are pleased to welcome you on the website Jan Store</p>
          <hr>
          <p>Click on the button below to verify your email</p>
          <button><a href="${url}">Verify account</a></button>
      </body>
      
      </html>`,
    };
    transporter.sendMail(mailOptions, (err, result) => {
      if (err) {
        console.log(err);
      } else {
        //console.log(result);
      }
    });
  } catch (err) {
    console.log(err);
  }
};

module.exports = { sendMail };
