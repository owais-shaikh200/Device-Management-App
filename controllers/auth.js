import User from "../models/User.js";
import asyncWrapper from "../middlewares/asyncWrapper.js";
import { createCustomError } from "../utils/customError.js";

export const register = asyncWrapper(async (req, res, next) => {
  const { name, email, password } = req.body;

  if (!name || !email || !password) {
    return next(createCustomError("Please provide all required fields", 400));
  }

  const user = await User.create({ name, email, password });

  const token = user.createJWT();

  res.status(201).json({
    user: {
      id: user._id,
      name: user.name,
      email: user.email,
    },
    token,
  });
});

export const login = asyncWrapper(async (req, res, next) => {
  const { email, password } = req.body;

  if (!email || !password) {
    return next(createCustomError("Please provide email and password", 400));
  }

  const user = await User.findOne({ email }).select("+password");

  if (!user) {
    return next(createCustomError("Invalid Credentials", 401));
  }

  const isPasswordCorrect = await user.comparePassword(password);

  if (!isPasswordCorrect) {
    return next(createCustomError("Invalid Credentials", 401));
  }

  const token = user.createJWT();

  res.status(200).json({
    user: {
      id: user._id,
      name: user.name,
      email: user.email,
    },
    token,
  });
});
