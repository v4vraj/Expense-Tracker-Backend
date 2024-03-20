const Group = require("./model/group.model");
const User = require("../User/model/user.model");
const { validationResult } = require("express-validator");

let io;

const setIO = (socketIO) => {
  io = socketIO;
};

const createGroup = async (req, res) => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }

    const { groupName, code, createdBy, users } = req.body;

    // Validate that createdBy exists in the User collection
    const existingCreatedByUser = await User.findById(createdBy);
    if (!existingCreatedByUser) {
      return res
        .status(400)
        .json({ error: "Invalid createdBy user specified" });
    }

    // Validate that all users in the group exist in the User collection
    const existingUsers = await User.find({
      _id: { $in: users.map((user) => user.userId) },
    });
    if (existingUsers.length !== users.length) {
      return res.status(400).json({ error: "Invalid user(s) specified" });
    }

    // Create the group with the provided data
    const group = new Group({ groupName, code, createdBy, users });
    await group.save();

    // Emit an event using socket.io for group creation
    io.emit("groupCreated", { code: group.code });

    res.status(201).json(group);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Internal Server Error" });
  }
};

const joinGroup = async (req, res) => {
  try {
    const { code, userId, email } = req.body;
    const user = await User.findById(userId); // Fetch user details including email

    if (!user) {
      return res.status(404).json({ error: "User not found" });
    }

    const group = await Group.findOne({ code });

    if (!group) {
      return res.status(404).json({ error: "Group not found" });
    }

    if (group.users.some((u) => u.userId.equals(userId))) {
      return res
        .status(400)
        .json({ error: "User is already a member of the group" });
    }

    const newUser = { userId: user._id, email: email };
    group.users.push(newUser);
    await group.save();

    res.status(200).json(group);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Internal Server Error" });
  }
};

const getGroups = async (req, res) => {
  try {
    const groups = await Group.find();
    res.status(200).json(groups);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Internal Server Error" });
  }
};

const getGroupByCode = async (req, res) => {
  try {
    const { code } = req.params;
    const group = await Group.findOne({ code });

    if (!group) {
      return res.status(404).json({ error: "Group not found" });
    }

    res.status(200).json(group);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Internal Server Error" });
  }
};

module.exports = {
  createGroup,
  joinGroup,
  getGroups,
  getGroupByCode,
  setIO,
};
