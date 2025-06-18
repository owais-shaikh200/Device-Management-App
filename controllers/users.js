import { createCustomError } from "../customErrors/customError.js";
import asyncWrapper from "../middlewares/asyncWrapper.js";
import User from "../models/User.js";
import Device from "../models/Device.js";

export const createUser = asyncWrapper(async (req, res) => {
  const user = await User.create(req.body);
  res.status(201).json({ user });
  console.log(req.body);
});

export const getAllUsers = asyncWrapper(async (req, res, next) => {
  const users = await User.find({});
  if (users.length === 0) {
    return next(createCustomError("No Users Found!", 404));
  }
  res.status(200).json({ users });
});

export const getSingleUser = asyncWrapper(async (req, res, next) => {
  const user = await User.findOne({ _id: req.params.id });
  if (!user) {
    return next(
      createCustomError(`No User Found with the id: ${req.params.id}!`, 404)
    );
  }
  res.status(200).json({ user });
});

export const updateUser = asyncWrapper(async (req, res, next) => {
  const user = await User.findOneAndUpdate({ _id: req.params.id }, req.body, {
    new: true,
    runValidators: true,
  });
  if (!user) {
    return next(
      createCustomError(`No User Found with the id: ${req.params.id}!`, 404)
    );
  }
  res.status(201).json({ user });
  console.log(req.body);
});

export const deleteUser = asyncWrapper(async (req, res, next) => {
  const user = await User.findById(req.params.id);

  if (!user) {
    return next(
      createCustomError(`No User Found with the id: ${req.params.id}!`, 404)
    );
  }

  await Device.updateMany(
    { user: user._id },
    { $unset: { user: "" } }
  );

  await User.findByIdAndDelete(user._id);

  res.status(200).send("User deleted successfully!");
});

