const User = require("../models/user.model");
const jwt = require("jsonwebtoken");
const bcrypt = require("bcrypt");


exports.login = async (req, res) => {
  try {
    const { email, password } = req.body;
    if (!email) throw new Error("Please provide username");
    if (!password) throw new Error("Please provide password");
    const user = await User.find({ email: email });
    if(user.length === 0) throw new Error("Wrong username or password");

    const validPassword = await bcrypt.compare(password, user[0].password);

    if (!validPassword) throw new Error("Wrong username or password");
    const token = jwt.sign(
      {role: user[0].role, email: user[0].email},
      process.env.JWT_SECRET,
      { expiresIn: "3h" }
    );

    res.json({
      message: "Login successful",
      token,
      data: { email: user[0].email, role: user[0].role },
    });
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};

exports.register = async (req, res) => {
  try {
    const { email, password} = req.body;
    if (!email) throw new Error("Please provide email");
    if (!password) throw new Error("Please provide password");
    const hashedPassword = await bcrypt.hash(password, 10);
    const user = new User({ email, password: hashedPassword});
    await user.save();
    res.json({ message: "User registered successfully" });
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
}

