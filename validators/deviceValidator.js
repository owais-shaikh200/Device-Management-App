import { body } from "express-validator";

export const createDeviceValidator = [
  body("name")
    .trim()
    .notEmpty()
    .withMessage("Device name is required")
    .isLength({ max: 100 })
    .withMessage("Device name must be less than 100 characters"),

  body("model")
    .trim()
    .notEmpty()
    .withMessage("Device model is required"),

  body("manufacturer")
    .trim()
    .notEmpty()
    .withMessage("Manufacturer is required"),

  body("user")
    .notEmpty()
    .withMessage("Associated user ID is required"),
];

export const updateDeviceValidator = [
  body("name")
    .optional()
    .trim()
    .isLength({ max: 100 })
    .withMessage("Device name must be less than 100 characters"),

  body("model")
    .optional()
    .trim(),

  body("manufacturer")
    .optional()
    .trim(),

  body("user")
    .optional(),
];
