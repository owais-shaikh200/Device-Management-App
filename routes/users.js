import express from "express";
const userRoutes = express.Router();

import {
  getAllUsers,
  getSingleUser,
  createUser,
  updateUser,
  deleteUser,
} from "../controllers/users.js";

import { createUserValidator, updateUserValidator } from "../validators/userValidator.js";
import {validate } from "../middlewares/validate.js";

userRoutes.get("/", getAllUsers);
userRoutes.get("/:id", getSingleUser);
userRoutes.post("/", createUserValidator, validate, createUser);
userRoutes.put("/:id", updateUserValidator, validate, updateUser);
userRoutes.delete("/:id", deleteUser);

export default userRoutes;
