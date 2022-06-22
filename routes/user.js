const express = require("express");

const router = express.Router();

router.get("/", (req, res) => {
  return res.status(200).render("user/user");
});

router.get("/register", (req, res) => {
  return res.status(200).render("user/register");
});

router.get("/login", (req, res) => {
  return res.status(200).render("user/login");
});

router.post("/register", (req, res) => {});

router.post("/login", (req, res) => {});

module.exports = router;
