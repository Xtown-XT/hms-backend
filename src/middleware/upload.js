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

const uploadFolder = path.join("hms_uploads", "category");
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
const profileUploadDir = "hms_uploads/profile";
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
const mealUploadDir = "hms_uploads/meal";

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
//multi course meal
const multiCourseMealDir = "hms_uploads/multi_course_meals";

if (!fs.existsSync(multiCourseMealDir)) {
  fs.mkdirSync(multiCourseMealDir, { recursive: true });
}

const multiCourseMealStorage = multer.diskStorage({
  destination: (req, file, cb) => cb(null, multiCourseMealDir),
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
export const uploadMultiCourseMeal = multer({ storage: multiCourseMealStorage, fileFilter });




