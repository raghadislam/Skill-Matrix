const multer = require('multer');
const sharp = require('sharp');
const streamifier = require('streamifier');

const AppError = require('../utils/appError');
const cloudinary = require('../utils/cloudinary');

class UploadService {
  #multerStorage = multer.memoryStorage();

  #multerFilter(req, file, cb) {
    const { fieldname, mimetype } = file;

    if (fieldname === 'photo') {
      return mimetype.startsWith('image')
        ? cb(null, true)
        : cb(
            new AppError(
              'Only image files are allowed for the photo field.',
              400,
            ),
            false,
          );
    }

    if (fieldname === 'resume') {
      return mimetype === 'application/pdf'
        ? cb(null, true)
        : cb(
            new AppError(
              'Only PDF files are allowed for the resume field.',
              400,
            ),
            false,
          );
    }

    return cb(new AppError(`Unexpected field '${fieldname}'.`, 400), false);
  }

  #createCombinedUpload() {
    return multer({
      storage: this.#multerStorage,
      fileFilter: this.#multerFilter.bind(this),
      limits: { fileSize: 5 * 1024 * 1024 }, // max 5MB per file
    });
  }

  getPhotoAndResumeUploader() {
    return this.#createCombinedUpload().fields([
      { name: 'photo', maxCount: 1 },
      { name: 'resume', maxCount: 1 },
    ]);
  }

  async resizeUserPhoto(req, res, next) {
    if (!req.files || !req.files.photo) return next();

    const photo = req.files.photo[0];
    const filename = `user-${req.user._id}-${Date.now()}`;

    // delete old photo from Cloudinary if exists
    if (req.user.photoPublicId) {
      try {
        await cloudinary.uploader.destroy(req.user.photoPublicId);
      } catch (err) {
        console.error('Failed to delete old photo from Cloudinary:', err);
      }
    }

    const sharpBuffer = await sharp(photo.buffer)
      .resize(500, 500)
      .toFormat('jpeg')
      .jpeg({ quality: 90 })
      .toBuffer();

    const result = await new Promise((resolve, reject) => {
      const uploadStream = cloudinary.uploader.upload_stream(
        {
          folder: 'users',
          public_id: filename,
          resource_type: 'image',
        },
        (error, results) => {
          if (error) return reject(error);
          resolve(results);
        },
      );

      streamifier.createReadStream(sharpBuffer).pipe(uploadStream);
    });

    req.uploadedPhoto = {
      url: result.secure_url,
      public_id: result.public_id,
    };

    next();
  }

  async uploadResumeToCloudinary(req, res, next) {
    if (!req.files?.resume?.[0]) return next();

    const file = req.files.resume[0];
    const filename = `resume-${req.user._id}-${Date.now()}`;

    // delete old resume from Cloudinary if exists
    if (req.user.resumePublicId) {
      try {
        await cloudinary.uploader.destroy(req.user.resumePublicId, {
          resource_type: 'raw',
        });
      } catch (err) {
        console.error('Failed to delete old resume from Cloudinary:', err);
      }
    }

    try {
      const result = await new Promise((resolve, reject) => {
        const uploadStream = cloudinary.uploader.upload_stream(
          {
            folder: 'resumes',
            public_id: filename,
            resource_type: 'raw', // for PDF, DOCX, etc.
          },
          (error, results) => {
            if (error) return reject(error);
            resolve(results);
          },
        );

        streamifier.createReadStream(file.buffer).pipe(uploadStream);
      });

      req.uploadedResume = {
        url: result.secure_url,
        public_id: result.public_id,
      };

      next();
    } catch (err) {
      return next(new AppError('Failed to upload resume to Cloudinary', 500));
    }
  }
}

module.exports = new UploadService();
