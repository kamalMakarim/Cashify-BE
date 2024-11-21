const jwt = require("jsonwebtoken");
const bcrypt = require("bcrypt");
const User = require("../models/user.model");

exports.login = async (req, res) => {
  try {
    const { email, password } = body;
    if (!email) throw new Error("Please provide email");
    if (!password) throw new Error("Please provide password");
    const user = await User.findOne({ email });

    if (!user) throw new Error("Wrong email or password");

    const validPassword = await bcrypt.compare(password, user[0].password);

    if (!validPassword) throw new Error("Wrong email or password");
    const token = jwt.sign(
      { role: user.role, email: user.email },
      process.env.JWT_SECRET,
      { expiresIn: "3h" }
    );

    res.cookie("token", token, {
      httpOnly: true,
      secure: true,
      sameSite: "strict",
      maxAge: process.env.JWT_EXPIRES_IN * 60 * 60 * 1000,
    });

    res.status(200).json({
      success: true,
      message: "Login successful",
      data: {
        email: user.email,
        role: user.role,
        balance: user.balance,
        phoneNumber: user.phoneNumber,
      },
    });
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};
