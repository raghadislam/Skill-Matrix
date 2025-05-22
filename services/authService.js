const jwt = require('jsonwebtoken');

const User = require('../models/userModel');

class AuthService {
  #signToken(id) {
    return jwt.sign({ id }, process.env.JWT_SECRET, {
      expiresIn: process.env.JWT_EXPIRES_IN,
    });
  }

  async signup(data, res) {
    const user = await User.create(data);
    const token = this.#signToken(user._id);

    user.password = undefined;

    return {
      status: 'success',
      statusCode: 201,
      token,
      user,
    };
  }
}

module.exports = new AuthService();
