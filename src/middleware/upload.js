import multer from "multer";
import path from "path";
import fs from "fs";

// ------------------ Category Upload ------------------
const categoryUploadDir = "uploads/category";
if (!fs.existsSync(categoryUploadDir)) fs.mkdirSync(categoryUploadDir, { recursive: true });

const categoryStorage = multer.diskStorage({
  destination: (req, file, cb) => cb(null, categoryUploadDir),
  filename: (req, file, cb) => {
    const ext = path.extname(file.originalname).toLowerCase();
    const unique = `${Date.now()}-${Math.round(Math.random() * 1e9)}${ext}`;
    cb(null, unique);
  },
});

// ------------------ Profile Upload ------------------
const profileUploadDir = "uploads/profile";
if (!fs.existsSync(profileUploadDir)) fs.mkdirSync(profileUploadDir, { recursive: true });

const profileStorage = multer.diskStorage({
  destination: (req, file, cb) => cb(null, profileUploadDir),
  filename: (req, file, cb) => {
    const ext = path.extname(file.originalname).toLowerCase();
    const unique = `${Date.now()}-${Math.round(Math.random() * 1e9)}${ext}`;
    cb(null, unique);
  },
});

// ------------------ File Filter ------------------
const fileFilter = (req, file, cb) => {
  const allowed = /jpeg|jpg|png|webp/;
  const ext = path.extname(file.originalname).toLowerCase();
  if (allowed.test(ext)) cb(null, true);
  else cb(new Error("Only jpeg, jpg, png, webp allowed"));
};

// ------------------ Exports ------------------
export const uploadCategory = multer({ storage: categoryStorage, fileFilter });
export const uploadProfile = multer({ storage: profileStorage, fileFilter });
