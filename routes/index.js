const express = require("express");
const { appendFile } = require("fs");

const router = express.Router();

router.get("/", (req, res) => {
  return res.status(200).render("index");
});

module.exports = router;
