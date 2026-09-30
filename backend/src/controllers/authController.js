const jwt = require("jsonwebtoken");
const User = require("../models/User");

const sign = (u) =>
  jwt.sign({ id: u._id, role: u.role }, process.env.JWT_SECRET, { expiresIn: "7d" });
const publicUser = (u) => ({
  id: u._id, name: u.name, email: u.email, role: u.role, shelterName: u.shelterName,
});

exports.register = async (req, res) => {
  try {
    const { name, password, role, shelterName } = req.body;
    const email = req.body.email?.toLowerCase().trim();
    if (!["adopter", "shelter"].includes(role)) {
      return res.status(400).json({ message: "Choose adopter or shelter" });
    }
    if (await User.findOne({ email })) {
      return res.status(409).json({ message: "Email already registered" });
    }
    const user = await User.create({ name, email, password, role, shelterName });
    res.status(201).json({ token: sign(user), user: publicUser(user) });
  } catch (err) {
    res.status(400).json({ message: err.message });
  }
};

exports.login = async (req, res) => {
  try {
    const email = req.body.email?.toLowerCase().trim();
    const user = await User.findOne({ email }).select("+password");
    if (!user || !(await user.matchPassword(req.body.password || ""))) {
      return res.status(401).json({ message: "Invalid email or password" });
    }
    res.json({ token: sign(user), user: publicUser(user) });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

exports.me = async (req, res) => {
  const user = await User.findById(req.user.id);
  if (!user) return res.status(404).json({ message: "User not found" });
  res.json({ user: publicUser(user) });
};