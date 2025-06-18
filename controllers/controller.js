import { createCustomError } from "../customErrors/customError.js";
import asyncWrapper from "../middlewares/asyncWrapper.js";
import Controller from "../models/Controller.js";
import Device from "../models/Device.js";

export const createController = asyncWrapper(async (req, res) => {
  const { name, email, phone, devices } = req.body;

  const controller = await Controller.create({
    name,
    email,
    phone,
    devices,
  });

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
  const { controllerID } = req.params;
  if (!controllerID) {
    return next(createCustomError("Controller ID is required!", 400));
  }
  const controller = await Controller.findById(controllerID).populate("devices");
  if (!controller) {
    return next(
      createCustomError(`No Controller Found with the id: ${req.params.id}!`, 404)
    );
  }
  res.status(200).json({ controller });
});

export const updateController = asyncWrapper(async (req, res, next) => {
  const {controllerID} = req.params;
  const { name, email, phone, devices } = req.body;
  if (!name || !email || !phone) {
    return next(createCustomError("Name, email, and phone are required!", 400));
  }
  const controller = await Controller.findByIdAndUpdate(controllerID, {
    name, 
    email, 
    phone, 
    devices
  }, {
    new: true,
    runValidators: true,
  });
  if (!controller) {
    return next(
      createCustomError(`No Controller Found with the id: ${controllerID}!`, 404)
    );
  }
  res.status(200).json({ controller });
});

export const deleteController = asyncWrapper(async (req, res, next) => {
  const { controllerID } = req.params;
  const controller = await Controller.findById(controllerID);
  
  if (!controller) {
    return next(
      createCustomError(`No Controller Found with the id: ${controllerID}!`, 404)
    );
  }

  await Device.updateMany(
    { controllers: controller._id },
    { $pull: { controllers: controller._id } }
  );

  await Controller.findByIdAndDelete(controllerID);

  res.status(200).send("Controller deleted successfully!");
});
