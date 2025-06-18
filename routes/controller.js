import express from "express";
const controllerRoutes = express.Router();

import {
  getAllControllers,
  getSingleController,
  createController,
  updateController,
  deleteController,
} from "../controllers/controller.js";

import {
  createControllerValidator,
  updateControllerValidator,
} from "../validators/controllerValidator.js";

import { validate } from "../middlewares/validate.js";

controllerRoutes.get("/", getAllControllers);
controllerRoutes.get("/:id", getSingleController);
controllerRoutes.post("/", createControllerValidator, validate, createController);
controllerRoutes.put("/:id", updateControllerValidator, validate, updateController);
controllerRoutes.delete("/:id", deleteController);

export default controllerRoutes;
