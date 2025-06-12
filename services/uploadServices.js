const multer = require('multer');
const sharp = require('sharp');

const AppError = require('../utils/appError');

class UploadService {
  #multerStorage = multer.memoryStorage();

  #multerFilter(req, file, cb) {
    if (file.mimetype.startsWith('image')) {
      cb(null, true);
    } else {
      cb(new AppError('Not an image! Please upload only images', 400), false);
    }
  }

  #createUpload() {
    return multer({
      storage: this.#multerStorage,
      fileFilter: this.#multerFilter.bind(this),
    });
  }

  getUserPhotoUploader() {
    return this.#createUpload().single('photo');
  }

  async resizeUserPhoto(req, res, next) {
    if (!req.file) return next();

    req.file.filename = `user-${req.user.id}-${Date.now()}.jpeg`;

    await sharp(req.file.buffer)
      .resize(500, 500)
      .toFormat('jpeg')
      .jpeg({ quality: 90 })
      .toFile(`public/img/users/${req.file.filename}`);

    next();
  }
}

module.exports = new UploadService();
