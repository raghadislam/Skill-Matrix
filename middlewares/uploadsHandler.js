const AppError = require('../utils/appError');

const Uploader = require('../utils/cloudinary');

exports.handlePhotoUpload = async (req, res, next) => {
  if (!req.files?.photo?.[0]) return next();

  const file = req.files.photo[0];
  const filename = `user-${req.user._id}-${Date.now()}`;

  try {
    const resizedBuffer = await Uploader.resizeImage(file.buffer);
    await Uploader.deleteCloudinaryFile(req.user.photoPublicId);

    const result = await Uploader.uploadBufferToCloudinary(resizedBuffer, {
      folder: 'users',
      public_id: filename,
      resource_type: 'image',
    });

    req.uploadedPhoto = {
      url: result.secure_url,
      public_id: result.public_id,
    };

    next();
  } catch (err) {
    console.error(err);
    next(new AppError('Failed to upload photo to Cloudinary', 500));
  }
};

exports.handleResumeUpload = async (req, res, next) => {
  if (!req.files?.resume?.[0]) return next();

  const file = req.files.resume[0];
  const filename = `resume-${req.user._id}-${Date.now()}`;

  try {
    await Uploader.deleteCloudinaryFile(req.user.resumePublicId, 'raw');

    const result = await Uploader.uploadBufferToCloudinary(file.buffer, {
      folder: 'resumes',
      public_id: filename,
      resource_type: 'raw',
    });

    req.uploadedResume = {
      url: result.secure_url,
      public_id: result.public_id,
    };

    next();
  } catch (err) {
    console.error(err);
    next(new AppError('Failed to upload resume to Cloudinary', 500));
  }
};
