const LocalStrategy = require("passport-local");
const passport = require("passport");
const User = require("../models/User");
const bcrypt = require("bcrypt");

const verify = async (email, password, done) => {
  try {
    const user = await User.findOne({ email });

    if (!user) {
      return done(null, false, { message: "that email is not registered" });
    }
    if (!user.verified) {
      return done(null, false, {
        message: "please verify your email",
      });
    }
    bcrypt.compare(password, user.password, (err, result) => {
      if (err) {
        return done(err);
      }
      if (result) {
        return done(null, user);
      }
      return done(null, false, { message: "password incorrect" });
    });
  } catch (err) {
    return done(err);
  }
};

passport.use(new LocalStrategy({ usernameField: "email" }, verify));
passport.serializeUser((user, done) => {
  done(null, user._id);
});
passport.deserializeUser((id, done) => {
  return done(null, id);
});
