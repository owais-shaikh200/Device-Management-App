import mongoose from "mongoose";

const deviceSchema = new mongoose.Schema({
  name: {
    type: String,
    required: [true, "Device name is required!"],
    trim: true,
  },
  model: {
    type: String,
    required: true,
  },
  serialNumber: {
    type: String,
    unique: true,
    required: true,
  },
  manufacturer: {
    type: String,
    required: true,
  },
  user: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User",
    required: true,
  },
  controllers: [
    {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Controller",
    },
  ],
  images: {
    type: [String],
    default: []
  },
  status: {
    type: String,
    enum: ["active", "inactive", "maintenance"],
    default: "active",
  },
  installedAt: {
    type: Date,
    default: Date.now,
  },
});

const Device = mongoose.model("Device", deviceSchema);
export default Device;
