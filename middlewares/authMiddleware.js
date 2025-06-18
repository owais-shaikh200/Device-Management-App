import jwt from "jsonwebtoken";
import { createCustomError } from "../customErrors/customError.js";

export const authenticateUser = (req, res, next) => {
  const authHeader = req.headers.authorization;

  // Check if Authorization header exists and starts with "Bearer "
  if (!authHeader || !authHeader.startsWith("Bearer ")) {
    return next(createCustomError("Authentication Invalid!", 401));
  }

  const token = authHeader.split(" ")[1];

  try {
    const payload = jwt.verify(token, process.env.JWT_SECRET);
    req.user = { userId: payload.userId, name: payload.name };
    next();
  } catch (error) {
    return next(createCustomError("Authentication Invalid!", 401));
  }
};
