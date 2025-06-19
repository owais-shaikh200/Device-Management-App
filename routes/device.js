/**
 * @swagger
 * tags:
 *   name: Devices
 *   description: API endpoints for managing devices
 */

/**
 * @swagger
 * /api/devices:
 *   get:
 *     summary: Get all devices
 *     tags: [Devices]
 *     responses:
 *       200:
 *         description: List of all devices
 *       404:
 *         description: No Devices Found
 */

/**
 * @swagger
 * /api/devices/{id}:
 *   get:
 *     summary: Get a single device by ID
 *     tags: [Devices]
 *     parameters:
 *       - in: path
 *         name: id
 *         schema:
 *           type: string
 *         required: true
 *         description: MongoDB ObjectId of the device
 *     responses:
 *       200:
 *         description: Device found
 *       404:
 *         description: Device not found
 */

/**
 * @swagger
 * /api/devices:
 *   post:
 *     summary: Create a new device
 *     tags: [Devices]
 *     consumes:
 *       - multipart/form-data
 *     requestBody:
 *       required: true
 *       content:
 *         multipart/form-data:
 *           schema:
 *             type: object
 *             required:
 *               - name
 *               - model
 *               - serialNumber
 *               - manufacturer
 *               - user
 *             properties:
 *               name:
 *                 type: string
 *               model:
 *                 type: string
 *               serialNumber:
 *                 type: string
 *               manufacturer:
 *                 type: string
 *               user:
 *                 type: string
 *                 description: ObjectId of the user
 *               controllers:
 *                 type: array
 *                 items:
 *                   type: string
 *                 description: Array of controller ObjectIds
 *               status:
 *                 type: string
 *                 enum: [active, inactive, maintenance]
 *               images:
 *                 type: array
 *                 items:
 *                   type: string
 *                   format: binary
 *     responses:
 *       201:
 *         description: Device created successfully
 *       400:
 *         description: Validation error
 */

/**
 * @swagger
 * /api/devices/{id}:
 *   put:
 *     summary: Update a device
 *     tags: [Devices]
 *     consumes:
 *       - multipart/form-data
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *         description: The device ID
 *     requestBody:
 *       content:
 *         multipart/form-data:
 *           schema:
 *             type: object
 *             properties:
 *               name:
 *                 type: string
 *               model:
 *                 type: string
 *               serialNumber:
 *                 type: string
 *               manufacturer:
 *                 type: string
 *               user:
 *                 type: string
 *               controllers:
 *                 type: array
 *                 items:
 *                   type: string
 *               status:
 *                 type: string
 *                 enum: [active, inactive, maintenance]
 *               images:
 *                 type: array
 *                 items:
 *                   type: string
 *                   format: binary
 *     responses:
 *       200:
 *         description: Device updated successfully
 *       404:
 *         description: Device not found
 */

/**
 * @swagger
 * /api/devices/{id}:
 *   delete:
 *     summary: Delete a device
 *     tags: [Devices]
 *     parameters:
 *       - in: path
 *         name: id
 *         schema:
 *           type: string
 *         required: true
 *         description: The device ID
 *     responses:
 *       200:
 *         description: Device deleted successfully
 *       404:
 *         description: Device not found
 */



import express from "express";
import { authenticateUser } from "../middlewares/authMiddleware.js";
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

deviceRoutes
  .route("/")
  .get(authenticateUser, getAllDevices)
  .post(
    authenticateUser,
    upload.array("images"),
    createDeviceValidator,
    validate,
    createDevice
  );

deviceRoutes
  .route("/:id")
  .get(authenticateUser, getSingleDevice)
  .put(
    authenticateUser,
    upload.array("images"),
    updateDeviceValidator,
    validate,
    updateDevice
  )
  .delete(authenticateUser, deleteDevice);


export default deviceRoutes;
