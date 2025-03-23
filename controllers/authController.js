const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const User = require("../models/userModel");
const CustomError = require("../utils/customError");

exports.register = async (req, res, next) => {
  try {
    const { email, password } = req.body;
    if (!email || !password)
      throw new CustomError("Email and Password are required", 400);

    const existingUser = await User.findOne({ where: { email } });
    if (existingUser) throw new CustomError("User already exists", 409);

    const hashedPassword = await bcrypt.hash(password, 10);
    const user = await User.create({ email, password: hashedPassword });

    res.status(201).json({ message: "User created successfully", user });
  } catch (error) {
    next(error);
  }
};

exports.login = async (req, res, next) => {
  try {
    const { email, password } = req.body;
    if (!email || !password)
      throw new CustomError("Email and Password are required", 400);

    const user = await User.findOne({ where: { email } });
    if (!user || !(await bcrypt.compare(password, user.password))) {
      throw new CustomError("Invalid credentials", 401);
    }

    const token = jwt.sign({ id: user.id }, "secret", { expiresIn: "1h" });
    res.json({ message: "Login successful", token });
  } catch (error) {
    next(error);
  }
};
