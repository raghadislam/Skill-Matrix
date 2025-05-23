const { z } = require('zod');

const queryZodSchema = require('./queryValidator');

exports.getAllUsersZodSchema = z.object({
  query: queryZodSchema.partial(),
});

exports.getUserZodSchema = z.object({
  params: z.object({
    id: z.string().regex(/^[0-9a-fA-F]{24}$/, 'Invalid user ID format'),
  }),
});
