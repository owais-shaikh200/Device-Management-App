import express from "express";
import dotenv from "dotenv";
dotenv.config();
import connectDB from "./db/connection.js";
import userRoutes from "./routes/users.js";
import authRoutes from "./routes/auth.js";
import controllerRoutes from "./routes/controller.js";
import deviceRoutes from "./routes/device.js";
import {errorHandlerMiddleware} from "./middlewares/errorHandler.js";
import swaggerUi from "swagger-ui-express";
import swaggerSpec from "./config/swagger.js";

const app = express();
const port = process.env.PORT || 5000;

// Connect to MongoDB
connectDB();

// Middleware to parse JSON
app.use(express.json());

// Routes
app.use("/api/auth", authRoutes);
app.use("/api/users", userRoutes);
app.use("/api/controllers", controllerRoutes);
app.use("/api/devices", deviceRoutes);

// Base route
app.get("/", (req, res) => {
  res.status(200).send("Welcome to the Device Management API");
});

app.use("/api-docs", swaggerUi.serve, swaggerUi.setup(swaggerSpec));

// Global error handler
app.use(errorHandlerMiddleware);



// Start server
app.listen(port, () => {
  console.log(`Server is running on port ${port}...`);
});
