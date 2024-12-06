const User = require("../models/user.model");
const jwt = require("jsonwebtoken");
const bcrypt = require("bcrypt");

exports.register = async (req, res) => {
  try {
    const { email, password } = req.body;
    if (!email) throw new Error("Please provide email");
    if (!password) throw new Error("Please provide password");
    const hashedPassword = await bcrypt.hash(password, 10);
    let user = new User({ email, password: hashedPassword });
    await user.save();
    user.password = "";
    res.json({
      success: true,
      message: "User registered successfully",
      data: user,
    });
  } catch (error) {
    res.status(400).json({ success: false, message: error.message });
  }
};

exports.transfer = async (req, res) => {
  if (!req.body.amount) {
    return res
      .status(400)
      .json({ success: false, message: "Amount is required" });
  }
  if (!req.body.recipient_id && !req.body.email) {
    return res
      .status(400)
      .json({ success: false, message: "Recipient ID or email is required" });
  }
  try {
    const { amount, recipient_id } = req.body;
    const senderId = req.user._id;
    const recipient = await User.findOne({
      $or: [{ _id: recipient_id }, { email: req.body.email }],
    });
    if (!recipient) {
      return res
        .status(400)
        .json({ success: false, message: "Recipient not found" });
    }
    const sender = await User.findById(senderId);
    if (!sender) {
      return res
        .status(400)
        .json({ success: false, message: "Sender not found" });
    }
    if (sender.balance < amount) {
      return res
        .status(400)
        .json({ success: false, message: "Insufficient balance" });
    }
    sender.balance -= amount;
    recipient.balance += amount;
    await User.updateOne({ _id: senderId }, { balance: sender.balance });
    await User.updateOne({ _id: recipient._id }, { balance: recipient.balance });
    res.json({
      success: true,
      message: "Transfer successful",
      data: { sender: sender, recipient: recipient },
    });
  } catch (error) {
    res.status(400).json({ success: false, message: error.message });
  }
};
