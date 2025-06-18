import mongoose from "mongoose";
import dotenv from "dotenv";
dotenv.config();
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";

const userSchema = new mongoose.Schema({
  name: {
    type: String,
    required: [true, "User name is required!"],
    trim: true,
  },
  email: {
    type: String,
    required: [true, "Email is required!"],
    unique: true,
    lowercase: true,
    match: [
      /^\S+@\S+\.\S+$/,
      "Please provide a valid email address.",
    ],
  },
  password: {
    type: String,
    required: [true, "Password is required!"],
    minlength: 6,
    select: false, // exclude password from queries by default
  },
}, { timestamps: true });

// Hash password before saving
userSchema.pre("save", async function () {
  if (!this.isModified("password")) return;
  const salt = await bcrypt.genSalt(10);
  this.password = await bcrypt.hash(this.password, salt);
});

// Method to generate JWT token
userSchema.methods.createJWT = function () {
  return jwt.sign(
    { userId: this._id, name: this.name },
    process.env.JWT_SECRET,
    {
      expiresIn: process.env.JWT_LIFETIME,
    }
  );
};

// Method to compare password during login
userSchema.methods.comparePassword = async function (candidatePassword) {
  return await bcrypt.compare(candidatePassword, this.password);
};

const User = mongoose.model("User", userSchema);
export default User;
