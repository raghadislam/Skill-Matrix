const { z } = require('zod');
const mongoose = require('mongoose');

const objectId = z
  .string()
  .refine((val) => mongoose.Types.ObjectId.isValid(val), {
    message: 'Invalid ObjectId format',
  });

const queryZodSchema = require('./queryValidator');
const idParamsValidator = require('./idParamsValidator');

const getAllPathsZodSchema = z.object({
  query: queryZodSchema.partial(),
});

const getPathZodSchema = z.object({
  params: idParamsValidator.partial(),
});

const deletePathZodSchema = z.object({
  params: idParamsValidator.partial(),
});

const createPathSchema = z.object({
  body: z
    .object({
      name: z.string().trim().min(1, 'Learning path must have a name'),

      description: z
        .string()
        .trim()
        .min(1, 'Learning path must have a description'),

      orderedCourses: z
        .array(objectId)
        .nonempty('Learning path must include at least one course'),
    })
    .strict(),
});

const updatePathZodSchema = z.object({
  params: idParamsValidator,

  body: createPathSchema.shape.body
    .partial()
    .refine((data) => Object.keys(data).length > 0, {
      message: 'You must provide at least one field to update',
      path: ['body'],
    }),
});

module.exports = {
  getAllPathsZodSchema,
  getPathZodSchema,
  deletePathZodSchema,
  createPathSchema,
  updatePathZodSchema,
};
