const express = require("express");
const User = require("../models/User");
const bcrypt = require("bcrypt");
const nodemailer = require("../config/nodemailer");
const httpStatusCodes = require("../config/httpStatusCodes");
const jwt = require("jsonwebtoken");

const router = express.Router();

router.get("/user", (req, res) => {
  return res.status(httpStatusCodes.OK).render("user/user");
});

router.get("/register", (req, res) => {
  return res.status(httpStatusCodes.OK).render("user/register");
});

router.get("/login", (req, res) => {
  return res.status(httpStatusCodes.OK).render("user/login");
});

router.get("/mailverify", (req, res) => {
  const tokenMailVerification = req.query.id;
  if (tokenMailVerification) {
    jwt.verify(
      tokenMailVerification,
      process.env.TOKEN_MAIL_VERIFICATION_SECRET,
      async (err, decoded) => {
        if (err) {
          console.log(err);
          return res
            .status(httpStatusCodes.Forbidden)
            .json("mail token is expired!");
        } else {
          try {
            const id = decoded.id;
            const user = await User.findOneAndUpdate(
              { id },
              { verified: true }
            );
            req.flash("success", "you account has been successfully verified");
            return res.status(httpStatusCodes.OK).redirect("/login");
          } catch (err) {
            console.log(err);
          }
        }
      }
    );
  } else {
    return res.status(httpStatusCodes.Forbidden).render("notFound");
  }
});

router.post("/register", (req, res) => {
  const { firstName, lastName, email, password, passwordRepeat } = req.body;

  if (firstName.length < 3) {
    req.flash("error", "first name should contain at least 3 characters");
    return res.status(httpStatusCodes.BadRequest).redirect("/register");
  }
  if (lastName.length < 2) {
    req.flash("error", "last name should contain at least 2 characters");
    return res.status(httpStatusCodes.BadRequest).redirect("/register");
  }
  if (password.length < 6) {
    req.flash("error", "password should contain at least 6 characters");
    return res.status(httpStatusCodes.BadRequest).redirect("/register");
  }
  if (password !== passwordRepeat) {
    req.flash("error", "passwords aren't equal");
    return res.status(httpStatusCodes.BadRequest).redirect("/register");
  }

  bcrypt.hash(password, 10, async (err, hash) => {
    if (err) {
      console.log(err);
    }
    try {
      const existingUser = await User.findOne({ email });
      if (existingUser) {
        req.flash("error", "user with that email already exist");
        return res.status(httpStatusCodes.BadRequest).redirect("/register");
      }
      const user = await User.create({
        first_name: firstName,
        last_name: lastName,
        email: email,
        password: hash,
      });
      nodemailer.sendMail(email, firstName, user._id);
      req.flash("success", "you have been successfully registered");
      return res.status(httpStatusCodes.Created).redirect("/login");
    } catch (err) {
      console.log(err);
    }
  });
});

router.post("/login", (req, res) => {});

module.exports = router;
