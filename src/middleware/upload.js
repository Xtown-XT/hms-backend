import multer from "multer";
import path from "path";
import fs from "fs";

// ------------------ Category Upload ------------------
// const categoryUploadDir = "uploads/category";
// if (!fs.existsSync(categoryUploadDir)) fs.mkdirSync(categoryUploadDir, { recursive: true });

// const categoryStorage = multer.diskStorage({
//   destination: (req, file, cb) => cb(null, categoryUploadDir),
//   filename: (req, file, cb) => {
//     const ext = path.extname(file.originalname).toLowerCase();
//     const unique = `${Date.now()}-${Math.round(Math.random() * 1e9)}${ext}`;
//     cb(null, unique);
//   },
// });

const uploadFolder = path.join("uploads", "category");
if (!fs.existsSync(uploadFolder)) fs.mkdirSync(uploadFolder, { recursive: true });

const storage = multer.diskStorage({
  // destination: (req, file, cb) => cb(null, uploadFolder),
  // filename: (req, file, cb) => {
  //   const uniqueName = Date.now() + "_" + file.originalname.replace(/\s+/g, "_");
  //   cb(null, uniqueName);
  // },

   destination: (req, file, cb) => cb(null, uploadFolder),
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
// meal-item
const mealUploadDir = "uploads/meal";

if (!fs.existsSync(mealUploadDir)) {
  fs.mkdirSync(mealUploadDir, { recursive: true });
}

const mealStorage = multer.diskStorage({
  destination: (req, file, cb) => cb(null, mealUploadDir),
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
// export const uploadCategory = multer({ storage: categoryStorage, fileFilter });
export const uploadCategoryImage = multer({ storage });
export const uploadProfile = multer({ storage: profileStorage, fileFilter });
export const uploadMealItem = multer({ storage: mealStorage, fileFilter });




// src/middleware/upload.js
// import multer from "multer";
// import path from "path";
// import fs from "fs";

// // Create folder if missing
// const makeDirIfNotExists = (dir) => {
//   if (!fs.existsSync(dir)) fs.mkdirSync(dir, { recursive: true });
// };

// /**
//  * Reusable Single File Upload Middleware
//  * 
//  * @param {string} fieldName  - form-data field name (default: "image")
//  * @param {string} folderName - folder under /uploads (employees, subcategories, products...)
//  */
// export const uploadSingle = (fieldName = "image", folderName = "uploads") => {
//   const uploadDir = path.join(process.cwd(), "uploads", folderName);

//   makeDirIfNotExists(uploadDir);

//   const storage = multer.diskStorage({
//     destination: (req, file, cb) => {
//       cb(null, uploadDir);
//     },
//     filename: (req, file, cb) => {
//       const ext = path.extname(file.originalname);
//       const base = path.basename(file.originalname, ext).replace(/\s+/g, "_");

//       const filename = `${Date.now()}_${Math.round(
//         Math.random() * 1e9
//       )}_${base}${ext}`;

//       cb(null, filename);
//     },
//   });

//   const fileFilter = (req, file, cb) => {
//     const allowed = ["image/jpeg", "image/png", "image/jpg", "image/webp"];
//     if (allowed.includes(file.mimetype)) return cb(null, true);

//     cb(new Error("Only .jpg, .jpeg, .png, and .webp formats allowed"), false);
//   };

//   return multer({
//     storage,
//     limits: { fileSize: 5 * 1024 * 1024 }, // 5MB
//     fileFilter,
//   }).single(fieldName);
// };

// export default uploadSingle;