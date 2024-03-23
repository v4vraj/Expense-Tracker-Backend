const express = require("express");
const userController = require("./user.controller");

const router = express.Router();

router.post("/addUser", userController.addUser);
router.post("/login", userController.login);

module.exports = router;
