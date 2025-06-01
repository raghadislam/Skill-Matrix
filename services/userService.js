const User = require('../models/userModel');
const Enrollment = require('../models/enrollmentModel');
const APIFeatures = require('../utils/apiFeatures');

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
    return await Enrollment.find({ userId });
  }
}

module.exports = new UserService();
