import express from "express";
import { upload } from "../middlewares/multer.js";
import {
  getAllDevices,
  getSingleDevice,
  createDevice,
  updateDevice,
  deleteDevice,
} from "../controllers/device.js";

import {
  createDeviceValidator,
  updateDeviceValidator,
} from "../validators/deviceValidator.js";

import { validate } from "../middlewares/validate.js";
const deviceRoutes = express.Router();

deviceRoutes.get("/", getAllDevices);
deviceRoutes.get("/:id", getSingleDevice);
deviceRoutes.post(
  "/",
  upload.array("images"),
  createDeviceValidator,
  validate,
  createDevice
);
deviceRoutes.put(
  "/:id",
  upload.array("images"),
  updateDeviceValidator,
  validate,
  updateDevice
);
deviceRoutes.delete("/:id", deleteDevice);

export default deviceRoutes;
