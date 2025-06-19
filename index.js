import express from "express";
import connectDB from "./db/connection.js";
import { port } from "./config/envConfig.js";
import {userRoutes, authRoutes, controllerRoutes, deviceRoutes} from "./routes/index.js";
import {errorHandlerMiddleware} from "./middlewares/errorHandler.js";
import swaggerUi from "swagger-ui-express";
import swaggerSpec from "./config/swagger.js";

const app = express();

connectDB();

app.use(express.json());

app.use("/api/auth", authRoutes);
app.use("/api/users", userRoutes);
app.use("/api/controllers", controllerRoutes);
app.use("/api/devices", deviceRoutes);

app.get("/", (req, res) => {
  res.status(200).send("Welcome to the Device Management API");
});

app.use("/api-docs", swaggerUi.serve, swaggerUi.setup(swaggerSpec));

app.use(errorHandlerMiddleware);

app.listen(port, () => {
  console.log(`Server is running on port ${port}...`);
});
