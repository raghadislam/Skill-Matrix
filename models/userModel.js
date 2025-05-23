const mongoose = require('mongoose');
const validator = require('validator');
const bcrypt = require('bcryptjs');

const ROLE = require('../utils/role');

const userSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: [true, 'Please tell us your name!'],
    },
    email: {
      type: String,
      required: [true, 'Please provide your email'],
      unique: true,
      lowercase: true,
      validate: [validator.isEmail, 'Please provide a valid email'],
    },
    role: {
      type: String,
      enum: Object.values(ROLE),
      default: ROLE.TRAINER,
    },
    password: {
      type: String,
      required: [true, 'Please provide a password'],
      minlength: [
        8,
        'A user password must have greater or equal than 8 characters',
      ],
      select: false,
    },
    passwordChangedAt: Date,
  },
  {
    // ===> This turns on automatic createdAt & updatedAt
    timestamps: true,

    toJSON: { virtuals: true },
    toObject: { virtuals: true },
  },
);

userSchema.path('createdAt').select(false);
userSchema.path('updatedAt').select(false);

userSchema.pre(/^update|.*Update.*$/, function (next) {
  const update = this.getUpdate();
  if (this.isNew || !update) return next();

  update.$set = {
    ...(update.$set || {}),
    updatedAt: Date.now(),
  };
  this.setUpdate(update);

  next();
});

userSchema.pre('save', async function (next) {
  if (!this.isModified('password')) return next();

  this.password = await bcrypt.hash(this.password, 12);
  next();
});

userSchema.pre('save', function (next) {
  if (!this.isModified('password') || this.isNew) return next();

  this.passwordChangedAt = Date.now() - 1000;
  next();
});

userSchema.methods.changedPasswordAfter = function (JWTTimestamp) {
  if (!this.changePasswordAfter) return false;

  const changedTimestamp = parseInt(
    this.passwordChangedAt.getTime() / 1000,
    10,
  );
  return changedTimestamp > JWTTimestamp;
};

const User = mongoose.model('User', userSchema);

module.exports = User;
