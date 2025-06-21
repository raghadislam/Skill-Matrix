const sharp = require('sharp');
const streamifier = require('streamifier');
const cloudinary = require('../config/cloudinaryConfig');

class Uploader {
  static async resizeImage(buffer, width = 500, height = 500) {
    return sharp(buffer)
      .resize(width, height)
      .toFormat('jpeg')
      .jpeg({ quality: 90 })
      .toBuffer();
  }

  static async uploadBufferToCloudinary(buffer, options) {
    return new Promise((resolve, reject) => {
      const uploadStream = cloudinary.uploader.upload_stream(
        options,
        (err, result) => {
          if (err) return reject(err);
          resolve(result);
        },
      );

      streamifier.createReadStream(buffer).pipe(uploadStream);
    });
  }

  static async deleteCloudinaryFile(publicId, resourceType = 'image') {
    if (!publicId) return;
    try {
      await cloudinary.uploader.destroy(publicId, {
        resource_type: resourceType,
      });
    } catch (err) {
      console.error(`[Uploader] Delete failed for ${publicId}`, err);
    }
  }
}

module.exports = Uploader;
