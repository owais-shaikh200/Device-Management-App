/**
 * @swagger
 * tags:
 *   name: Controllers
 *   description: API endpoints for managing controllers
 */

/**
 * @swagger
 * /api/controllers:
 *   get:
 *     summary: Get all controllers
 *     tags: [Controllers]
 *     responses:
 *       200:
 *         description: List of all controllers
 *       404:
 *         description: No Controllers Found
 */

/**
 * @swagger
 * /api/controllers/{id}:
 *   get:
 *     summary: Get a single controller by ID
 *     tags: [Controllers]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *         description: MongoDB ObjectId of the controller
 *     responses:
 *       200:
 *         description: Controller found
 *       404:
 *         description: Controller not found
 */

/**
 * @swagger
 * /api/controllers:
 *   post:
 *     summary: Create a new controller
 *     tags: [Controllers]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - name
 *               - type
 *             properties:
 *               name:
 *                 type: string
 *               type:
 *                 type: string
 *               devices:
 *                 type: array
 *                 items:
 *                   type: string
 *                   description: ObjectId of a device
 *     responses:
 *       201:
 *         description: Controller created successfully
 *       400:
 *         description: Validation error
 */

/**
 * @swagger
 * /api/controllers/{id}:
 *   put:
 *     summary: Update a controller
 *     tags: [Controllers]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *         description: Controller ID
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               name:
 *                 type: string
 *               type:
 *                 type: string
 *               devices:
 *                 type: array
 *                 items:
 *                   type: string
 *     responses:
 *       200:
 *         description: Controller updated successfully
 *       404:
 *         description: Controller not found
 */

/**
 * @swagger
 * /api/controllers/{id}:
 *   delete:
 *     summary: Delete a controller
 *     tags: [Controllers]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *         description: Controller ID
 *     responses:
 *       200:
 *         description: Controller deleted successfully
 *       404:
 *         description: Controller not found
 */


import express from "express";
import { authenticateUser } from "../middlewares/authMiddleware.js";
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

controllerRoutes.get("/", authenticateUser, getAllControllers);
controllerRoutes.get("/:id", authenticateUser, getSingleController);
controllerRoutes.post("/", authenticateUser, createControllerValidator, validate, createController);
controllerRoutes.put("/:id", authenticateUser, updateControllerValidator, validate, updateController);
controllerRoutes.delete("/:id", authenticateUser, deleteController);

export default controllerRoutes;
