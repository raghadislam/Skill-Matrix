const jwt = require('jsonwebtoken');
const { promisify } = require('util');
const bcrypt = require('bcryptjs');

const User = require('../models/userModel');
const RefreshToken = require('../models/refreshTokenModel');
const AppError = require('../utils/appError');

const signAsync = promisify(jwt.sign);
const verifyAsync = promisify(jwt.verify);

const MAX_SESSION_AGE_MS = 30 * 24 * 60 * 60 * 1000;

class AuthService {
  async #createTokens(userId) {
    const payload = { id: userId };
    const [accessToken, refreshToken] = await Promise.all([
      signAsync(payload, process.env.ACCESS_TOKEN_SECRET, {
        expiresIn: process.env.ACCESS_TOKEN_EXPIRES_IN,
      }),
      signAsync(payload, process.env.REFRESH_TOKEN_SECRET, {
        expiresIn: process.env.REFRESH_TOKEN_EXPIRES_IN,
      }),
    ]);

    return { accessToken, refreshToken };
  }

  async #findStoredToken(userId, oldRefreshToken) {
    const tokens = await RefreshToken.find({ user: userId }).select('+token');

    const comparisons = await Promise.all(
      tokens.map((t) => bcrypt.compare(oldRefreshToken, t.token)),
    );
    const index = comparisons.findIndex((result) => result);

    return index !== -1 ? tokens[index] : undefined;
  }

  async signup(data) {
    const user = await User.create(data);

    const { accessToken, refreshToken } = await this.#createTokens(user._id);

    await RefreshToken.create({
      user: user._id,
      token: refreshToken,
      expiresAt: new Date(Date.now() + MAX_SESSION_AGE_MS),
    });

    user.password = undefined;

    return {
      status: 'success',
      statusCode: 201,
      accessToken,
      refreshToken,
      user,
    };
  }

  async login(data) {
    const { email, password } = data;

    if (!email || !password) {
      throw new AppError('Please provide email and password', 400);
    }

    const user = await User.findOne({ email }).select('+password');
    if (!user || !(await user.correctPassword(password))) {
      throw new AppError('Incorrect email or password', 401);
    }

    const { accessToken, refreshToken } = await this.#createTokens(user._id);

    await RefreshToken.create({
      user: user._id,
      token: refreshToken,
      expiresAt: new Date(Date.now() + MAX_SESSION_AGE_MS),
    });

    return {
      status: 'success',
      statusCode: 200,
      accessToken,
      refreshToken,
      user,
    };
  }

  async refresh(oldRefreshToken) {
    if (!oldRefreshToken)
      throw new AppError(
        'Authentication required: no refresh token provided',
        401,
      );

    let userId;
    try {
      ({ id: userId } = await verifyAsync(
        oldRefreshToken,
        process.env.REFRESH_TOKEN_SECRET,
      ));
    } catch (err) {
      throw new AppError('Invalid refresh token', 401);
    }

    const matchedToken = await this.#findStoredToken(userId, oldRefreshToken);
    if (!matchedToken)
      throw new AppError('Refresh token not found or already revoked', 401);

    await RefreshToken.findByIdAndDelete(matchedToken._id);

    const { accessToken, refreshToken } = await this.#createTokens(userId);

    await RefreshToken.create({
      user: userId,
      token: refreshToken,
      expiresAt: new Date(Date.now() + MAX_SESSION_AGE_MS),
    });

    return {
      status: 'success',
      statusCode: 200,
      accessToken,
      refreshToken,
    };
  }

  async logout(oldRefreshToken) {
    if (!oldRefreshToken)
      throw new AppError(
        'Authentication required: no refresh token provided',
        401,
      );

    let userId;
    try {
      ({ id: userId } = await verifyAsync(
        oldRefreshToken,
        process.env.REFRESH_TOKEN_SECRET,
      ));
    } catch (err) {
      throw new AppError('Invalid refresh token', 401);
    }

    const matchedToken = await this.#findStoredToken(userId, oldRefreshToken);
    if (!matchedToken)
      throw new AppError('Refresh token not found or already revoked', 401);

    await RefreshToken.findByIdAndDelete(matchedToken._id);

    return {
      status: 'success',
      statusCode: 200,
    };
  }
}

module.exports = new AuthService();
