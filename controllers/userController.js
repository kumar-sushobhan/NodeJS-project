const User = require("../models/userModel");
const CustomError = require("../utils/customError");

exports.getUserById = async (req, res, next) => {
  try {
    const user = await User.findByPk(req.params.id, {
      attributes: ["id", "email"],
    });
    if (!user) throw new CustomError("User not found", 404);

    res.json(user);
  } catch (error) {
    next(error);
  }
};

exports.getUserByEmail = async (req, res, next) => {
  try {
    const user = await User.findOne({
      where: { email: req.params.email },
      attributes: ["id", "email"],
    });
    if (!user) throw new CustomError("User not found", 404);

    res.json(user);
  } catch (error) {
    next(error);
  }
};
