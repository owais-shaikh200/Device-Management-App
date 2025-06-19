import { v2 as cloudinary } from "cloudinary";
import { cloudinary_cloud_name, cloudinary_api_key, cloudinary_api_secret } from "./envConfig.js";

cloudinary.config({
  cloud_name: cloudinary_cloud_name,
  api_key: cloudinary_api_key,
  api_secret: cloudinary_api_secret,
});

export default cloudinary;
