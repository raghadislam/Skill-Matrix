const User = require('../models/userModel');
const APIFeatures = require('../utils/apiFeatures');

class UserService {
  async getAllUsers(queryString) {
    const feature = new APIFeatures(User.find(), queryString)
      .filter()
      .sort()
      .limitFields()
      .paginate();

    return await feature.query.lean();
  }

  async getUser(id) {
    return await User.findById(id);
  }

  async deleteUser(id) {
    return await User.findByIdAndDelete(id);
  }
}

module.exports = new UserService();
