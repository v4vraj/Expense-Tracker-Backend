const express = require("express");
const mongoose = require("mongoose");
const cors = require("cors");
require("dotenv").config();

const app = express();
const port = 3000;
app.use(cors());
app.use(express.json());

mongoose.connect(process.env.MONGOOSE_URL, { useUnifiedTopology: true });
const db = mongoose.connection;
db.on("error", console.error.bind(console, "MongoDB connection error"));
db.once("open", () => {
  console.log("Connection to DB");
});

app.listen(port, () => {
  console.log(`Server is running on Port ${port}`);
});
