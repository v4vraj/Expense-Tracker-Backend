const mongoose = require("mongoose");
require("dotenv").config();

mongoose.connect(process.env.MONGOOSE_URL, { useUnifiedTopology: true });
const db = mongoose.connection;

db.on("error", console.error.bind(console, "MongoDB connection error"));
db.once("open", () => {
  console.log("Connection to DB");
});

module.exports = db;
