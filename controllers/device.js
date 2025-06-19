import { createCustomError } from "../utils/customError.js";
import asyncWrapper from "../middlewares/asyncWrapper.js";
import Device from "../models/Device.js";
import Controller from "../models/Controller.js";
import cloudinary from "../config/cloudinary.js";
import {uploadToCloudinary} from "../utils/cloudinaryUpload.js";
import { paginate } from "../utils/paginate.js";

export const createDevice = asyncWrapper(async (req, res, next) => {
  let imageUrls = [];

  if (req.files && req.files.length > 0) {
    try {
      const uploadPromises = req.files.map((file) =>
        uploadToCloudinary(file.buffer)
      );
      imageUrls = await Promise.all(uploadPromises);
    } catch (err) {
      console.error("Cloudinary upload error:", err);
      return next(createCustomError("Image upload failed!", 500));
    }
  }

  let {
    name,
    model,
    serialNumber,
    manufacturer,
    user,
    controllers,
    status
  } = req.body;

  if (controllers && !Array.isArray(controllers)) {
    controllers = [controllers];
  }

  const device = await Device.create({
    name,
    model,
    serialNumber,
    manufacturer,
    user,
    controllers,
    status,
    images: imageUrls
  });

  res.status(201).json({ device });
});

export const getAllDevices = asyncWrapper(async (req, res, next) => {
  const { page, limit, skip } = paginate(req.query);

  const [devices, total] = await Promise.all([
    Device.find({})
      .skip(skip)
      .limit(limit)
      .populate("user")
      .populate("controllers"),
    Device.countDocuments()
  ]);

  if (!devices.length) {
    return next(createCustomError("No devices found!", 404));
  }

  res.status(200).json({
    totalItems: total,
    currentPage: page,
    itemsPerPage: limit,
    items: devices
  });
});


export const getSingleDevice = asyncWrapper(async (req, res, next) => {
  const { id } = req.params;
  const device = await Device.findOne({ _id: id })
    .populate("user")
    .populate("controllers");

  if (!device) {
    return next(
      createCustomError(`No Device Found with the id: ${req.params.id}!`, 404)
    );
  }
  res.status(200).json({ device });
});

export const updateDevice = asyncWrapper(async (req, res, next) => {
  const { id } = req.params;
  let imageUrls = [];

  if (req.files && req.files.length > 0) {
    try {
      const uploadPromises = req.files.map((file) =>
        uploadToCloudinary(file.buffer)
      );
      imageUrls = await Promise.all(uploadPromises);
    } catch (err) {
      console.error("Cloudinary upload error:", err);
      return next(createCustomError("Image upload failed!", 500));
    }
  }

  let {
    name,
    model,
    serialNumber,
    manufacturer,
    user,
    controllers,
    status
  } = req.body;

  if (controllers && !Array.isArray(controllers)) {
    controllers = [controllers];
  }

  const updatedData = {
    ...(name && { name }),
    ...(model && { model }),
    ...(serialNumber && { serialNumber }),
    ...(manufacturer && { manufacturer }),
    ...(user && { user }),
    ...(controllers && { controllers }),
    ...(status && { status }),
    ...(imageUrls.length > 0 && { images: imageUrls })
  };

  const device = await Device.findOneAndUpdate(
    { _id: id },
    updatedData,
    { new: true, runValidators: true }
  );

  if (!device) {
    return next(
      createCustomError(`No Device Found with the id: ${req.params.id}!`, 404)
    );
  }

  res.status(200).json({ device });
});


export const deleteDevice = asyncWrapper(async (req, res, next) => {
  const { id } = req.params;
  const device = await Device.findById(id);

  if (!device) {
    return next(
      createCustomError(`No Device Found with the id: ${id}!`, 404)
    );
  }

  const imageDeletionPromises = device.images.map((imageUrl) => {
    
    const publicIdWithExtension = imageUrl.split("/").pop();
    const publicId = publicIdWithExtension.split(".")[0];    
    return cloudinary.uploader.destroy(publicId);
  });

  await Promise.all(imageDeletionPromises);

  await Controller.updateMany(
    { _id: { $in: device.controllers } },
    { $pull: { devices: device._id } }
  );

  await Device.findByIdAndDelete(device._id);

  res.status(200).send("Device deleted successfully!");
});


