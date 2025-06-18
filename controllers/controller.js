import { createCustomError } from "../customErrors/customError.js";
import asyncWrapper from "../middlewares/asyncWrapper.js";
import Controller from "../models/Controller.js";

export const createController = asyncWrapper(async (req, res) => {
  const controller = await Controller.create(req.body);
  res.status(201).json({ controller });
});

export const getAllControllers = asyncWrapper(async (req, res, next) => {
  const controllers = await Controller.find({}).populate("devices");
  if (controllers.length === 0) {
    return next(createCustomError("No Controller Found!", 404));
  }
  res.status(200).json({ controllers });
});

export const getSingleController = asyncWrapper(async (req, res, next) => {
  const controller = await Controller.findById(req.params.id).populate("devices");
  if (!controller) {
    return next(
      createCustomError(`No Controller Found with the id: ${req.params.id}!`, 404)
    );
  }
  res.status(200).json({ controller });
});

export const updateController = asyncWrapper(async (req, res, next) => {
  const controller = await Controller.findByIdAndUpdate(req.params.id, req.body, {
    new: true,
    runValidators: true,
  });
  if (!controller) {
    return next(
      createCustomError(`No Controller Found with the id: ${req.params.id}!`, 404)
    );
  }
  res.status(200).json({ controller });
});

export const deleteController = asyncWrapper(async (req, res, next) => {
  const controller = await Controller.findByIdAndDelete(req.params.id);
  if (!controller) {
    return next(
      createCustomError(`No Controller Found with the id: ${req.params.id}!`, 404)
    );
  }
  res.status(200).send("Controller deleted successfully!");
});
