const express = require("express");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const User = require("../models/User");
const {
  validateUserRegistration,
  validateUserLogin,
} = require("../dtos/userRequest");

const router = express.Router();
const JWT_SECRET = process.env.JWT_SECRET;

// ✅ Register User (Uses DTO for validation)
router.post("/register", validateUserRegistration, async (req, res) => {
  try {
    const { email, password } = req.body;
    const hashedPassword = await bcrypt.hash(password, 10);
    const user = new User({ email, password: hashedPassword });

    await user.save();
    res.status(201).json({ id: user._id, message: "User registered" });
  } catch (error) {
    res.status(500).json({ error: "Server error" });
  }
});

// ✅ Login User (Uses DTO for validation)
router.post("/login", validateUserLogin, async (req, res) => {
  try {
    const { email, password } = req.body;
    const user = await User.findOne({ email });

    if (!user || !(await bcrypt.compare(password, user.password))) {
      return res.status(401).json({ error: "Invalid credentials" });
    }

    const token = jwt.sign({ id: user._id }, JWT_SECRET, { expiresIn: "1h" });
    res.json({ token });
  } catch (error) {
    res.status(500).json({ error: "Server error" });
  }
});

module.exports = router;
