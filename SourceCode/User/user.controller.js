const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const User = require("./model/user.model");

const userController = {
  addUser: async (req, res) => {
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
      res.status(200).json({ message: "User added successfully" });
    } catch (error) {
      console.error("Error adding user", error);
      res.status(500).json({ error: "Internal Server Error" });
    }
  },

  login: async (req, res) => {
    try {
      const { email, password } = req.body;
      const user = await User.findOne({ email });

      if (!user) {
        return res.status(404).json({ error: "User not found" });
      }

      const isPasswordValid = await bcrypt.compare(password, user.password);
      if (!isPasswordValid) {
        return res.status(401).json({ error: "Invalid password" });
      }

      // JWT
      const token = jwt.sign({ userId: user._id }, process.env.JWT_SECRET, {
        expiresIn: "1h",
      });

      return res.json({ token });
    } catch (error) {
      console.error("Error", error);
      res.status(500).json({ error: "Internal Server Error" });
    }
  },

  // Add other controllers as needed
};

module.exports = userController;
