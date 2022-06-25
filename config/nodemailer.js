const nodemailer = require("nodemailer");
const { google } = require("googleapis");
const OAuth2 = google.auth.OAuth2;
const jwt = require("jsonwebtoken");

const createTokenMailVerification = (id) => {
  const date = new Date();
  const payload = {
    id: id,
    created: date,
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
      html: `<h2>Hello ${firstName}</h2><p>Click on the link below to veriy your account</p><p>${url}</p>`,
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
