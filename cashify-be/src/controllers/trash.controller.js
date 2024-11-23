const Trash = require("../models/trash.model");
const User = require("../models/user.model");

const trashPrice = {
  cardboard: 500,
  glass: 2000,
  metal: 1000,
  paper: 100,
  plastic: 100,
  trash: 100,
};

exports.create = async (req, res) => {
  if (!req.body.trashType) {
    return res
      .status(400)
      .json({ success: false, message: "Trash type is required" });
  }
  if (!req.body.collecter_id) {
    return res
      .status(400)
      .json({ success: false, message: "Collecter ID is required" });
  }
  try {
    const { trashType, collecter_id } = req.body;
    const trash = new Trash({ trashType, collected_at: collecter_id });
    await trash.save();
    res.json({ success: true, message: "Trash created successfully", data: trash });
  } catch (error) {
    res.status(400).json({ success: false, message: error.message });
  }
};

exports.claim = async (req, res) => {
  if (!req.body.trashId) {
    return res
      .status(400)
      .json({ success: false, message: "Trash ID is required" });
  }
  if (!req.user._id) {
    return res
      .status(400)
      .json({ success: false, message: "User ID is required" });
  }
  try {
    const { trashId } = req.body;
    const userId = req.user._id;
    const trash = await Trash.findById(trashId);
    const user = await User.findById(userId);
    if (!user) {
      return res
        .status(400)
        .json({ success: false, message: "User not found" });
    }
    if (!trash) {
      return res
        .status(400)
        .json({ success: false, message: "Trash not found" });
    }
    await trash.save();
    user.balance += trashPrice[trash.trashType];
    await user.save();
    res.json({ success: true, message: "Trash claimed successfully" });
  } catch (error) {
    res.status(400).json({ success: false, message: error.message });
  }
};

exports.findUserTrash = async (req, res) => {
  if (!req.user._id) {
    return res
      .status(400)
      .json({ success: false, message: "User ID is required" });
  }
  try {
    const userId = req.user._id;
    const trash = await Trash.find({ user: userId });
    res.json({ success: true, data: trash });
  } catch (error) {
    res.status(400).json({ success: false, message: error.message });
  }
};
