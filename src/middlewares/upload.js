import multer from 'multer';

const storage = multer.memoryStorage();

const limits = {
  fileSize: 5 * 1024 * 1024, // 5 MB
};

const fileFilter = (req, file, cb) => {
  const allowedTypes = ['image/jpeg', 'image/png', 'image/webp'];
  if (allowedTypes.includes(file.mimetype)) {
    cb(null, true);
  } else {
    cb(new Error('Unsupported file type. Only JPG, PNG, and WEBP allowed.'));
  }
};

export const upload = multer({ storage, limits, fileFilter });