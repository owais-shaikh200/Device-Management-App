import { createCustomError } from "../utils/customError.js";
import asyncWrapper from "../middlewares/asyncWrapper.js";
import Controller from "../models/Controller.js";
import Device from "../models/Device.js";
import { paginate } from "../utils/paginate.js";

export const createController = asyncWrapper(async (req, res) => {
  const { name, email, role, devices } = req.body;
  
  if (!name || !email) {
    return res.status(400).json({ error: "Name, and email are required!" });
  }

  const controller = await Controller.create({
    name,
    email,
    role,
    devices,
  });

  res.status(201).json({ controller });
});


export const getAllControllers = asyncWrapper(async (req, res, next) => {
  const { page, limit, skip } = paginate(req.query);

  const [controllers, total] = await Promise.all([
    Controller.find({})
      .skip(skip)
      .limit(limit)
      .populate("devices"),
    Controller.countDocuments()
  ]);

  if (!controllers.length) {
    return next(createCustomError("No controllers found!", 404));
  }

  res.status(200).json({
    totalItems: total,
    currentPage: page,
    itemsPerPage: limit,
    items: controllers
  });
});



export const getSingleController = asyncWrapper(async (req, res, next) => {
  const { id } = req.params;
  if (!id) {
    return next(createCustomError("Controller ID is required!", 400));
  }
  const controller = await Controller.findById(id).populate("devices");
  if (!controller) {
    return next(
      createCustomError(`No Controller Found with the id: ${req.params.id}!`, 404)
    );
  }
  res.status(200).json({ controller });
});

export const updateController = asyncWrapper(async (req, res, next) => {
  const {id} = req.params;
  const { name, email, role, devices } = req.body;
  const controller = await Controller.findByIdAndUpdate(id, {
    name, 
    email, 
    role, 
    devices
  }, {
    new: true,
    runValidators: true,
  });
  if (!controller) {
    return next(
      createCustomError(`No Controller Found with the id: ${id}!`, 404)
    );
  }
  res.status(200).json({ controller });
});

export const deleteController = asyncWrapper(async (req, res, next) => {
  const { id } = req.params;
  const controller = await Controller.findById(id);
  
  if (!controller) {
    return next(
      createCustomError(`No Controller Found with the id: ${id}!`, 404)
    );
  }

  await Device.updateMany(
    { controllers: controller._id },
    { $pull: { controllers: controller._id } }
  );

  await Controller.findByIdAndDelete(id);

  res.status(200).send("Controller deleted successfully!");
});
