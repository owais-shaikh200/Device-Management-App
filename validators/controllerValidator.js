import { body } from "express-validator";

export const createControllerValidator = [
  body("name")
    .trim()
    .notEmpty()
    .withMessage("Controller name is required")
    .isLength({ max: 50 })
    .withMessage("Controller name must be less than 50 characters"),

  body("email")
    .trim()
    .notEmpty()
    .withMessage("Email is required")
    .isEmail()
    .withMessage("A valid email is required"),
];

export const updateControllerValidator = [
  body("name")
    .optional()
    .trim()
    .isLength({ max: 50 })
    .withMessage("Controller name must be less than 50 characters"),

  body("email")
    .optional()
    .trim()
    .isEmail()
    .withMessage("A valid email is required"),
];
