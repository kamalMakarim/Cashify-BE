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
  if (!req.body.trash_type) {
    return res
      .status(400)
      .json({ success: false, message: "Trash type is required" });
  }
  if (!req.body.collector_id) {
    return res
      .status(400)
      .json({ success: false, message: "collector ID is required" });
  }
  try {
    const { trash_type, collector_id } = req.body;
    const trash = new Trash({ trash_type, collected_at: collector_id });
    await trash.save();
    res.json({
      success: true,
      message: "Trash created successfully",
      data: trash,
    });
  } catch (error) {
    res.status(400).json({ success: false, message: error.message });
  }
};

exports.claim = async (req, res) => {
  if (!req.body.trash_id) {
    return res
      .status(400)
      .json({ success: false, message: "Trash ID is required" });
  }
  console.log(req.user);
  if (!req.user._id) {
    return res
      .status(400)
      .json({ success: false, message: "User ID is required" });
  }
  try {
    const { trash_id } = req.body;
    const userId = req.user._id;
    const trash = await Trash.findById(trash_id);
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
    if (trash.status === "claimed") {
      return res
        .status(400)
        .json({ success: false, message: "Trash already claimed" });
    }
    trash.status = "claimed";
    await trash.save();
    user.balance += trashPrice[trash.trash_type];
    await user.save();

    res.cookie("user", JSON.stringify(user), {
      httpOnly: false,
      secure: process.env.NODE_ENV === "production",
      sameSite: process.env.NODE_ENV === "production" ? "Strict" : "Lax",
      maxAge: process.env.JWT_EXPIRES_IN * 60 * 60 * 1000,
      path: "/",
    });

    res.json({
      success: true,
      message: "Trash claimed successfully",
      data: trash,
    });
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
