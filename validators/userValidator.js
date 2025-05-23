const { z } = require('zod');

const queryZodSchema = require('./queryValidator');

exports.getAllUsersZodSchema = z.object({
  query: queryZodSchema.partial(),
});
