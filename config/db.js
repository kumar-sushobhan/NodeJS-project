const { Sequelize } = require("sequelize");

const sequelize = new Sequelize("userdb", "admin", "admin123", {
  host: "db",
  dialect: "postgres",
  logging: false,
});

const connectDB = async () => {
  try {
    await sequelize.authenticate();
    console.log("✅ Connected to PostgreSQL");
  } catch (error) {
    console.error("❌ Database connection failed:", error);
  }
};

module.exports = { sequelize, connectDB };
