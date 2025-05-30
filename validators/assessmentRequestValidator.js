const z = require('zod');
const mongoose = require('mongoose');

const queryValidator = require('./queryValidator');
const idParamsValidator = require('./idParamsValidator');

const objectId = z
  .string()
  .refine((val) => mongoose.Types.ObjectId.isValid(val), {
    message: 'Invalid ObjectId format',
  });

const getAllRequestsZodSchema = z.object({
  query: queryValidator,
});

const getRequestZodSchema = z.object({
  params: idParamsValidator,
});

const createRequestZodSchema = z.object({
  body: z
    .object({
      user: objectId,

      assessment: objectId,
    })
    .strict(),
});

module.exports = {
  getAllRequestsZodSchema,
  getRequestZodSchema,
  createRequestZodSchema,
};
