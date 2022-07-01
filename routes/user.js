const express = require("express");
const User = require("../models/User");
const bcrypt = require("bcrypt");
const nodemailer = require("../config/nodemailer");
const httpStatusCodes = require("../config/httpStatusCodes");
const auth = require("../config/auth");
const jwt = require("jsonwebtoken");
const passport = require("passport");

const router = express.Router();

router.get("/user", auth.isAuthenticated, async (req, res) => {
  try {
    const userId = req.user;
    const user = await User.findOne({ userId });
    return res.status(httpStatusCodes.OK).render("user/user", { user });
  } catch (err) {
    console.log(err);
  }
});

router.get("/register", auth.alreadyAuthenticated, (req, res) => {
  return res.status(httpStatusCodes.OK).render("user/register");
});

router.get("/login", auth.alreadyAuthenticated, (req, res) => {
  return res.status(httpStatusCodes.OK).render("user/login");
});

router.get("/logout", (req, res, next) => {
  req.logout((err) => {
    if (err) {
      return next();
    }
    req.flash("success", "you are logged out");
    return res.redirect("/login");
  });
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
            return res
              .status(httpStatusCodes.OK)
              .json("your account has been successfully verified");
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
      req.flash(
        "success",
        "account has been created, please verify it on your email"
      );
      return res.status(httpStatusCodes.Created).redirect("/login");
    } catch (err) {
      console.log(err);
    }
  });
});

router.post(
  "/login",
  passport.authenticate("local", {
    // successRedirect: "/user",
    failureRedirect: "/login",
    failureFlash: true,
  }),
  (req, res) => {
    if (req.body.rememberMe) {
      req.session.cookie.maxAge = 1000 * 60 * 60 * 24 * 14; //cookie expires after 14 days
    } else {
      req.session.cookie.maxAge = null; // cookie expires at end of session
    }
    return res.redirect("/user");
  }
);

module.exports = router;
