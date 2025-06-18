import multer from "multer";

// Use memory storage to avoid saving files locally
const storage = multer.memoryStorage();

// File filter to allow image types only
const fileFilter = (req, file, cb) => {
  if (file.mimetype.startsWith("image/")) {
    cb(null, true);
  } else {
    cb(new Error("Only image files are allowed!"), false);
  }
};

export const upload = multer({
  storage,
  fileFilter,
  limits: { fileSize: 5 * 1024 * 1024 }, // limit to 5MB per file
});
