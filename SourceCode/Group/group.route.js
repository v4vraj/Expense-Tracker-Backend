const express = require("express");
const router = express.Router();
const groupController = require("./group.controller");

router.get("/getGroups", groupController.getGroups);
router.get("/getGroup/:code", groupController.getGroupByCode);
router.post("/createGroup", groupController.createGroup);
router.post("/joinGroup/:code", groupController.joinGroup);

module.exports = router;
