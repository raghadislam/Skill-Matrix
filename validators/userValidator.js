const { z } = require('zod');

const queryZodSchema = require('./queryValidator');
const idParamsValidator = require('./idParamsValidator');

exports.getAllUsersZodSchema = z.object({
  query: queryZodSchema.partial(),
});

exports.getUserZodSchema = z.object({
  params: idParamsValidator.partial(),
});

exports.deleteUserZodSchema = z.object({
  params: idParamsValidator.partial(),
});
