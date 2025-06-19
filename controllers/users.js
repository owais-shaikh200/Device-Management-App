import { createCustomError } from "../utils/customError.js";
import asyncWrapper from "../middlewares/asyncWrapper.js";
import User from "../models/User.js";
import Device from "../models/Device.js";
import { paginate } from "../utils/paginate.js";

export const createUser = asyncWrapper(async (req, res) => {
  const { name, email, password, phone, role } = req.body;

  const user = await User.create({
    name,
    email,
    password,
    phone,
    role
  });
  res.status(201).json({ user });
});

export const getAllUsers = asyncWrapper(async (req, res, next) => {
  const { page, limit, skip } = paginate(req.query);

  const [users, total] = await Promise.all([
    User.find({})
      .skip(skip)
      .limit(limit),
    User.countDocuments()
  ]);

  if (!users.length) {
    return next(createCustomError("No users found!", 404));
  }

  res.status(200).json({
    totalItems: total,
    currentPage: page,
    itemsPerPage: limit,
    items: users
  });
});

export const getSingleUser = asyncWrapper(async (req, res, next) => {
  const { id } = req.params;
  const user = await User.findOne({ _id: id });
  if (!user) {
    return next(
      createCustomError(`No User Found with the id: ${id}!`, 404)
    );
  }
  res.status(200).json({ user });
});

export const updateUser = asyncWrapper(async (req, res, next) => {
  const { id } = req.params;
  const { name, email, password, phone, role } = req.body;

  const user = await User.findOneAndUpdate(
    { _id: id },
    { name, email, password, phone, role },
    {
      new: true,
      runValidators: true,
    }
  );

  if (!user) {
    return next(
      createCustomError(`No User Found with the id: ${id}!`, 404)
    );
  }

  res.status(201).json({ user });
});


export const deleteUser = asyncWrapper(async (req, res, next) => {
  const { id } = req.params;
  const user = await User.findById(id);

  if (!user) {
    return next(
      createCustomError(`No User Found with the id: ${id}!`, 404)
    );
  }

  await Device.updateMany(
    { user: user._id },
    { $unset: { user: "" } }
  );

  await User.findByIdAndDelete(user._id);

  res.status(200).send("User deleted successfully!");
});

