require("dotenv").config();
const express = require("express");
const cors = require("cors");
const helmet = require("helmet");
const rateLimit = require("express-rate-limit");
const connectDB = require("./config/db");
const authRoutes = require("./routes/auth");
const userRoutes = require("./routes/users");

const app = express();
connectDB();

// Middlewares
app.use(express.json());
app.use(cors());
app.use(helmet());
app.use(rateLimit({ windowMs: 15 * 60 * 1000, max: 100 })); // Rate limiting

// Routes
app.use("/api/auth", authRoutes);
app.use("/api/users", userRoutes);

app.listen(5000, () => console.log("✅ Server running on port 5000"));
