const nodemailer = require("nodemailer");
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
  const transporter = nodemailer.createTransport({
    service: "gmail",
    auth: {
      user: process.env.USER_EMAIL,
      pass: process.env.USER_PASSWORD,
    },
  });
  const url = createTokenMailVerification(id);
  const mailOptions = {
    from: process.env.USER_EMAIL,
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
};

module.exports = { sendMail };
