const multer = require('multer');
const AppError = require('../utils/appError');

const multerStorage = multer.memoryStorage();

const fileFilter = (req, file, cb) => {
  const { fieldname, mimetype } = file;

  const isImage = mimetype.startsWith('image');
  const isPDF = mimetype === 'application/pdf';

  if (fieldname === 'photo') {
    return isImage
      ? cb(null, true)
      : cb(new AppError('Only image files allowed for photo.', 400), false);
  }

  if (fieldname === 'resume') {
    return isPDF
      ? cb(null, true)
      : cb(new AppError('Only PDF files allowed for resume.', 400), false);
  }

  return cb(new AppError(`Unexpected field '${fieldname}'`, 400), false);
};

const upload = multer({
  storage: multerStorage,
  fileFilter,
  limits: { fileSize: 5 * 1024 * 1024 },
}).fields([
  { name: 'photo', maxCount: 1 },
  { name: 'resume', maxCount: 1 },
]);

module.exports = upload;
