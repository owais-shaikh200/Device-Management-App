import { createCustomError } from "../customErrors/customError.js";
import asyncWrapper from "../middlewares/asyncWrapper.js";
import Device from "../models/Device.js";
import Controller from "../models/Controller.js";
import cloudinary from "../config/cloudinary.js";

const uploadToCloudinary = (fileBuffer) => {
  return new Promise((resolve, reject) => {
    const stream = cloudinary.uploader.upload_stream(
      { resource_type: "image" },
      (error, result) => {
        if (error) return reject(error);
        resolve(result.secure_url);
      }
    );
    stream.end(fileBuffer);
  });
};

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
  const devices = await Device.find({})
    .populate("user")
    .populate("controllers");

  if (devices.length === 0) {
    return next(createCustomError("No Devices Found!", 404));
  }
  res.status(200).json({ devices });
});

export const getSingleDevice = asyncWrapper(async (req, res, next) => {
  const { deviceID } = req.params;
  const device = await Device.findOne({ _id: deviceID })
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
  const { deviceID } = req.params;
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
    { _id: deviceID },
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
  const { deviceID } = req.params;
  const device = await Device.findById(deviceID);

  if (!device) {
    return next(
      createCustomError(`No Device Found with the id: ${deviceID}!`, 404)
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


