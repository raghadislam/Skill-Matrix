const User = require('../models/userModel');
const APIFeatures = require('../utils/apiFeatures');

class UserService {
  async getAllUsers(queryString) {
    const feature = new APIFeatures(User.find(), queryString)
      .filter()
      .sort()
      .limitFields()
      .paginate();

    const users = await feature.query.lean();

    return {
      users,
    };
  }
}

module.exports = new UserService();
