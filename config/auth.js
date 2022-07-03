const isAuthenticated = (req, res, next) => {
  if (req.isAuthenticated()) {
    return next();
  }
  if (req.originalUrl != "/logout") {
    req.flash("error", "please log in to view that resource");
  }
  res.redirect("/login");
};

const alreadyAuthenticated = (req, res, next) => {
  if (!req.isAuthenticated()) {
    return next();
  }
  res.redirect("/user");
};

module.exports = { isAuthenticated, alreadyAuthenticated };
