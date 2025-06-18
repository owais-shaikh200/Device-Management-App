import mongoose from "mongoose";
import dotenv from "dotenv";
dotenv.config();
import logError from "mongoose";
import handleError from "mongoose";

const MONGO_URI=process.env.MONGO_URI;

export default async function connectDB() {
  try {
    await mongoose.connect(MONGO_URI);
    console.log("Successfully connected to MongoDB!");
  } catch (error) {
    handleError(error);
  }

  mongoose.connection.on("error", (err) => {
    logError(err);
  });
}