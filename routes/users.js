const express = require("express");
const {
  getUserById,
  getUserByEmail,
} = require("../controllers/userController");
const authMiddleware = require("../middleware/authMiddleware");

const router = express.Router();

router.get("/:id", authMiddleware, getUserById);
router.get("/email/:email", authMiddleware, getUserByEmail);

module.exports = router;
