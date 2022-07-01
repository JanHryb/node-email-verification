require("dotenv").config();
require("./config/database");
const express = require("express");
const path = require("path");
const session = require("express-session");
const MongoStore = require("connect-mongo");
const flash = require("express-flash");
const httpStatusCodes = require("./config/httpStatusCodes");
const passport = require("passport");

const app = express();

app.set("view engine", "ejs");
app.use(express.urlencoded({ extended: true }));
app.use(express.json());
app.use("/public", express.static(path.join(__dirname, "public")));
app.use(
  session({
    secret: process.env.SESSION_SECRET,
    resave: false,
    saveUninitialized: false,
    store: MongoStore.create({
      mongoUrl: process.env.MONGODB_URL,
      dbName: "test",
    }),
  })
);
app.use(flash());
app.use(passport.initialize());
app.use(passport.authenticate("session"));
require("./config/passport");

// routes
app.use("/", require("./routes/index"));
app.use("/", require("./routes/user"));

app.get("*", (req, res) => {
  return res.status(httpStatusCodes.NotFound).render("notFound");
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`listening on port ${PORT}`);
});
