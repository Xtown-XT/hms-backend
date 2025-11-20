// src/middleware/upload.js
import multer from "multer";
import path from "path";
import fs from "fs";

// Create folder if missing
const makeDirIfNotExists = (dir) => {
  if (!fs.existsSync(dir)) fs.mkdirSync(dir, { recursive: true });
};

/**
 * Reusable Single File Upload Middleware
 * 
 * @param {string} fieldName  - form-data field name (default: "image")
 * @param {string} folderName - folder under /uploads (employees, subcategories, products...)
 */
export const uploadSingle = (fieldName = "image", folderName = "uploads") => {
  const uploadDir = path.join(process.cwd(), "uploads", folderName);

  makeDirIfNotExists(uploadDir);

  const storage = multer.diskStorage({
    destination: (req, file, cb) => {
      cb(null, uploadDir);
    },
    filename: (req, file, cb) => {
      const ext = path.extname(file.originalname);
      const base = path.basename(file.originalname, ext).replace(/\s+/g, "_");

      const filename = `${Date.now()}_${Math.round(
        Math.random() * 1e9
      )}_${base}${ext}`;

      cb(null, filename);
    },
  });

  const fileFilter = (req, file, cb) => {
    const allowed = ["image/jpeg", "image/png", "image/jpg", "image/webp"];
    if (allowed.includes(file.mimetype)) return cb(null, true);

    cb(new Error("Only .jpg, .jpeg, .png, and .webp formats allowed"), false);
  };

  return multer({
    storage,
    limits: { fileSize: 5 * 1024 * 1024 }, // 5MB
    fileFilter,
  }).single(fieldName);
};

export default uploadSingle;