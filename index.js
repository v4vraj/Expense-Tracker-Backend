const fs = require("fs");
const crypto = require("crypto");
const express = require("express");
const mongoose = require("mongoose");
const cors = require("cors");
require("dotenv").config();
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const User = require("./model/user.model");

const app = express();
const port = 3000;
app.use(cors());
app.use(express.json());

// if (!process.env.JWT_SECRET) {
//   // Generate a random secret key
//   const secretKey = crypto.randomBytes(32).toString("hex");

//   // Append the key to the .env file
//   fs.appendFileSync(".env", `JWT_SECRET=${secretKey}\n`);

//   console.log("Secret key generated and stored in .env file.");
// } else {
//   console.log(
//     "JWT_SECRET already defined in .env file. Skipping secret key generation."
//   );
// }

mongoose.connect(process.env.MONGOOSE_URL, { useUnifiedTopology: true });
const db = mongoose.connection;
db.on("error", console.error.bind(console, "MongoDB connection error"));
db.once("open", () => {
  console.log("Connection to DB");
});

app.post("/api/addUser", async (req, res) => {
  try {
    const { firstName, lastName, email, password } = req.body;
    const saltRounds = 10;
    const hashedPassword = await bcrypt.hash(password, saltRounds);
    const newUser = new User({
      firstName,
      lastName,
      email,
      password: hashedPassword,
    });
    await newUser.save();
    res.status(200).json({ message: "User added Successfully" });
  } catch (error) {
    console.log("Error adding User", error);
  }
});

app.post("/api/login", async (req, res) => {
  try {
    const { email, password } = req.body;
    const user = await User.findOne({ email });

    if (!user) {
      console.log("Invalid User");
    }

    const isPasswordValid = await bcrypt.compare(password, user.password);
    if (!isPasswordValid) {
      console.log("Invalid password");
    }

    // JWT
    const token = jwt.sign({ userId: user._id }, process.env.JWT_SECRET, {
      expiresIn: "1h",
    });

    return res.json({ token });
  } catch (error) {
    console.error("Error", error);
  }
});

app.listen(port, () => {
  console.log(`Server is running on Port ${port}`);
});
