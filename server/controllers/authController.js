const User = require("../models/User");
const generateToken = require("../utils/generateToken");

const register = async (req, res) => {
  try {
    const { name, email, password, role, college } = req.body;

    const existingUser = await User.findOne({ email });
    if (existingUser) {
      return res.status(400).json({ success: false, message: "Email already registered." });
    }

    const assignedRole = role === "admin" ? "student" : role || "student";
    const user = await User.create({ name, email, password, role: assignedRole, college });
    const token = generateToken(res, user._id);

    res.status(201).json({
      success: true,
      message: "Registration successful!",
      token,
      user: { _id: user._id, name: user.name, email: user.email, role: user.role },
    });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

const login = async (req, res) => {
  try {
    const { email, password } = req.body;
    if (!email || !password) {
      return res.status(400).json({ success: false, message: "Please provide email and password." });
    }

    
    
    const user = await User.findOne({ email }).select("+password +role +name +email +college");
    if (!user || !(await user.matchPassword(password))) {
      return res.status(401).json({ success: false, message: "Invalid email or password." });
    }

    const token = generateToken(res, user._id);
    res.status(200).json({
      success: true,
      message: "Login successful!",
      token,
      user: { _id: user._id, name: user.name, email: user.email, role: user.role },
    });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

const logout = (req, res) => {
  res.cookie("token", "", { httpOnly: true, expires: new Date(0) });
  res.status(200).json({ success: true, message: "Logged out successfully." });
};

const getMe = async (req, res) => {
  res.status(200).json({ success: true, user: req.user });
};

module.exports = { register, login, logout, getMe };