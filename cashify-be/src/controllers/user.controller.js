const User = require("../models/user.model");

exports.getAllUsers = async (req, res) => {
  try {
    const users = await User.find();
    res.status(200).json({ success: true, message: "Successfully retrieved all users", data: users });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

exports.getUserById = async (req, res) => {
  try {
    const user = await User.findById(req.query.id);
    res.status(200).json({ success: true, message: "Successfully retrieved user", data: user });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

exports.login = async (req, res) => {
  if (!req.body.username || !req.body.password) {
    return res.status(400).json({ message: "Username and password required" });
  }
  try {
    const user = await User.findOne({
      username: req.body.username,
      password: req.body.password,
    });
    res.status(200).json({ success: true, message: "Successfully logged in", data: user });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

exports.createUser = async (req, res) => {
  if (!req.body.username || !req.body.password) {
    return res.status(400).json({ message: "Username and password required" });
  }
  try {
    const user = new User({
      username: req.body.username,
      password: req.body.password,
    });
    await user.save();
    res.status(201).json({ success: true, message: "User created successfully", data: user });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

exports.updateUser = async (req, res) => {
  if (!req.query.id) {
    return res.status(400).json({ message: "Id required" });
  }
  if (!req.body.username || !req.body.password) {
    return res.status(400).json({ message: "Username and password required" });
  }
  try {
    const user = await User.findByIdAndUpdate(req.query.id, {
      username: req.body.username,
      password: req.body.password,
    });
    res.status(200).json({ success: true, message: "User updated successfully", data: user });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

exports.deleteUser = async (req, res) => {
  if (!req.query.id) {
    return res.status(400).json({ message: "Id required" });
  }
  try {
    const user = await User.findByIdAndDelete(req.query.id);
    res.status(200).json({ success: true, message: "User deleted successfully", data: user });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};
