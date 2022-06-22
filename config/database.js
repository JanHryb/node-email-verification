const mongoose = require("mongoose");

mongoose
  .connect(process.env.MONGODB_URL)
  .then(console.log("successfully connected to DB"))
  .catch((err) => {
    console.log(err);
  });
