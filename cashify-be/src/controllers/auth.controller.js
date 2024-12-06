const jwt = require("jsonwebtoken");
const bcrypt = require("bcrypt");
const User = require("../models/user.model");

exports.login = async (req, res) => {
  try {
    const { email, password } = req.body;
    if (!email) throw new Error("Please provide email");
    if (!password) throw new Error("Please provide password");
    const user = await User.findOne({ email });

    if (!user) throw new Error("Wrong email or password");

    const validPassword = await bcrypt.compare(password, user.password);

    if (!validPassword) throw new Error("Wrong email or password");
    const token = jwt.sign(
      { role: user.role, email: user.email, _id: user._id },
      process.env.JWT_SECRET,
      { expiresIn: "1d" }
    );

    res.cookie("token", token, {
      httpOnly: false,
      secure: process.env.NODE_ENV === "production", // True for HTTPS
      sameSite: process.env.NODE_ENV === "production" ? "None" : "Lax", // Cross-origin support
      domain:
        process.env.NODE_ENV === "production"
          ? ".vercel.app"
          : undefined,
      path: "/",
    });

    res.cookie("user", JSON.stringify(user), {
      httpOnly: false,
      secure: process.env.NODE_ENV === "production",
      sameSite: process.env.NODE_ENV === "production" ? "None" : "Lax",
      domain:
        process.env.NODE_ENV === "production"
          ? ".vercel.app"
          : undefined,
      path: "/"
    });

    res.status(200).json({
      success: true,
      message: "Login successful",
      data: {
        email: user.email,
        role: user.role,
        balance: user.balance,
        phoneNumber: user.phoneNumber,
        token: token,
      },
    });
  } catch (error) {
    res.status(400).json({ success: false, message: error.message });
  }
};
