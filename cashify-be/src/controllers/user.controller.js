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
    res.status(400).json({ message: error.message });
  }
};
