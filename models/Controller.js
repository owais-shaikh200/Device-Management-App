import mongoose from "mongoose";

const controllerSchema = new mongoose.Schema({
  name: {
    type: String,
    required: [true, "Name is required!"],
    trim: true,
    maxlength: [50, "Name cannot be more than 50 characters"],
  },
  email: {
    type: String,
    required: [true, "Email is required!"],
    unique: true,
    trim: true,
    match: [/^[^\s@]+@[^\s@]+\.[^\s@]+$/, "Please enter a valid email address"],
  },
  role: {
    type: String,
    enum: ["operator", "supervisor"],
    default: "operator",
  },
  devices: [
    {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Device"
    }
  ],
  createdAt: {
    type: Date,
    default: Date.now,
  },
});

const Controller = mongoose.model("Controller", controllerSchema);
export default Controller;
