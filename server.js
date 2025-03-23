const express = require("express");
const sequelize = require("./config/db");
const authRoutes = require("./routes/auth");
const userRoutes = require("./routes/users");
const rateLimiter = require("./utils/rateLimiter");
const errorHandler = require("./middleware/errorHandler");

const app = express();
app.use(express.json());
app.use(rateLimiter);

app.use("/auth", authRoutes);
app.use("/users", userRoutes);

// Apply error handler (MUST be the last middleware)
app.use(errorHandler);

sequelize
  .sync()
  .then(() => console.log("Database connected"))
  .catch((err) => console.error("Error connecting to DB", err));

app.listen(3000, () => console.log("Server running on port 3000"));
