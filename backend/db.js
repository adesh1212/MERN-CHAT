const mongoose = require("mongoose");
require("dotenv").config({ path: "../.env" });

const URI = process.env.MONGO_URI;

const connectDB = async () => {
  try {
    const conn = await mongoose.connect(URI);

    console.log("Connecetd to the DB");
  } catch (error) {
    console.log(error.message);
  }
};

module.exports = connectDB;
