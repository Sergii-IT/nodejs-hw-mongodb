import multer from 'multer';

// Зберігаємо файли у памʼяті — без запису на диск
const storage = multer.memoryStorage();

// Обмеження на розмір файлу (наприклад, 5MB)
const limits = {
  fileSize: 5 * 1024 * 1024, // 5 MB
};

// Фільтр для прийнятних типів файлів (лише зображення)
const fileFilter = (req, file, cb) => {
  const allowedTypes = ['image/jpeg', 'image/png', 'image/webp'];
  if (allowedTypes.includes(file.mimetype)) {
    cb(null, true);
  } else {
    cb(new Error('Unsupported file type. Only JPG, PNG, and WEBP allowed.'));
  }
};

export const upload = multer({
  storage,
  limits,
  fileFilter,
});