const express = require("express");
const User = require("../models/User");
const authenticateUser = require("../middleware/authMiddleware");

const router = express.Router();

// ✅ Fetch the logged-in user's profile
router.get("/me", authenticateUser, async (req, res) => {
  try {
    const user = await User.findById(req.user.id).select("-password"); // Exclude password
    if (!user) {
      return res.status(404).json({ error: "User not found" });
    }
    res.json(user);
  } catch (error) {
    res.status(500).json({ error: "Server error" });
  }
});

// ✅ Fetch user by email (New Endpoint)
router.get("/email/:email", authenticateUser, async (req, res) => {
  try {
    const user = await User.findOne({ email: req.params.email }).select(
      "-password"
    ); // Exclude password
    if (!user) {
      return res.status(404).json({ error: "User not found" });
    }
    res.json(user);
  } catch (error) {
    res.status(500).json({ error: "Server error" });
  }
});

// ✅ Search users by name or email (with pagination)
router.get("/search", authenticateUser, async (req, res) => {
  try {
    const { query, page = 1, limit = 10 } = req.query;

    if (!query) {
      return res.status(400).json({ error: "Search query is required" });
    }

    const searchRegex = new RegExp(query, "i"); // Case-insensitive search

    const users = await User.find({
      $or: [{ name: searchRegex }, { email: searchRegex }],
    })
      .select("-password") // Exclude password
      .limit(parseInt(limit))
      .skip((parseInt(page) - 1) * parseInt(limit));

    const totalUsers = await User.countDocuments({
      $or: [{ name: searchRegex }, { email: searchRegex }],
    });

    res.json({
      totalUsers,
      totalPages: Math.ceil(totalUsers / parseInt(limit)),
      currentPage: parseInt(page),
      users,
    });
  } catch (error) {
    res.status(500).json({ error: "Server error" });
  }
});

module.exports = router;
