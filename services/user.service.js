const User = require('../models/user.model');
const Enrollment = require('../models/enrollment.model');
const Notification = require('../models/notification.model');
const APIFeatures = require('../utils/apiFeatures');
const AppError = require('../utils/appError');
const cloudinary = require('../config/cloudinaryConfig');

class UserService {
  #population(query) {
    return query.populate({
      path: 'skills',
      select: 'name',
    });
  }

  async getAllUsers(queryString) {
    const query = this.#population(User.find());
    const feature = new APIFeatures(query, queryString)
      .filter()
      .sort()
      .limitFields()
      .paginate();

    return await feature.query.lean();
  }

  async getUser(id) {
    const query = this.#population(User.findById(id));
    return await query.lean();
  }

  async deleteUser(id) {
    return await User.findByIdAndDelete(id);
  }

  async updateUser(id, data) {
    let query = User.findByIdAndUpdate(id, data, {
      new: true,
      runValidators: true,
    });
    query = this.#population(query);

    return await query.lean();
  }

  async createUser(data) {
    const newUser = await User.create(data);
    newUser.password = undefined;

    return newUser;
  }

  async getEnrollments(userId) {
    return await Enrollment.find({ user: userId });
  }

  async getNotifications(userId, onlyUnread) {
    const filter = { user: userId };
    if (onlyUnread) filter.isRead = 0;

    return await Notification.find(filter);
  }

  async updateMe(userId, updatedData) {
    const updatedUser = await User.findByIdAndUpdate(userId, updatedData, {
      new: true,
      runValidators: true,
    });

    if (!updatedUser) {
      throw new AppError('User not found.', 404);
    }

    return updatedUser;
  }

  async deleteMe(id) {
    const user = await User.findById(id);

    if (user.photoPublicId) {
      await cloudinary.uploader.destroy(user.photoPublicId);
    }
    if (user.resumePublicId) {
      await cloudinary.uploader.destroy(user.resumePublicId, {
        resource_type: 'raw',
      });
    }

    await User.findByIdAndUpdate(id, { active: false });
  }
}

module.exports = new UserService();
