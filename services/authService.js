const jwt = require('jsonwebtoken');

const User = require('../models/userModel');
const AppError = require('../utils/appError');

class AuthService {
  #signToken(id) {
    return jwt.sign({ id }, process.env.JWT_SECRET, {
      expiresIn: process.env.JWT_EXPIRES_IN,
    });
  }

  async signup(data) {
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

  async login(data) {
    const { email, password } = data;

    if (!email || !password) {
      throw new AppError('Please provide email and password', 400);
    }

    const user = User.findOne({ email });
    if (!user || !(await user.correctPassword(password))) {
      throw new AppError('Incorrect email or password', 401);
    }
    const token = this.#signToken(user._id);

    return {
      status: 'success',
      statusCode: 200,
      token,
      user,
    };
  }
}

module.exports = new AuthService();
