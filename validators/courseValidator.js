const z = require('zod');
const mongoose = require('mongoose');

const idParamsValidator = require('./idParamsValidator');
const queryZodSchema = require('./queryValidator');
const DEPT = require('../utils/departments');

const objectId = z
  .string()
  .refine((val) => mongoose.Types.ObjectId.isValid(val), {
    message: 'Invalid ObjectId format',
  });

const courseBodySchema = z.object(
  {
    title: z.string().nonempty({ message: 'A course must have a title' }),

    description: z
      .string()
      .nonempty({ message: 'Course must have a description' }),

    durationHours: z
      .number({ invalid_type_error: 'durationHours must be a number' })
      .min(0, { message: 'Duration must be a positive number' }),

    prerequisites: z.array(objectId).optional().default([]),

    category: z.enum(Object.values(DEPT), {
      errorMap: () => ({
        message: `category must be one of: ${Object.values(DEPT).join(', ')}`,
      }),
    }),
  },
  {
    // to catch the extra keys
    errorMap: (issue, ctx) => {
      if (issue.code === z.ZodIssueCode.unrecognized_keys) {
        const extraFields = issue.keys.join(', ');
        return {
          message: `No extra fields are permitted in the request body: ${extraFields}`,
        };
      }
      return { message: ctx.defaultError };
    },
  },
);

exports.getAllCoursesZodSchema = z.object({
  query: queryZodSchema,
});

exports.getCourseZodSchema = z.object({
  params: idParamsValidator,
});

exports.createCourseZodSchema = z.object({
  body: courseBodySchema.strict(),
});

exports.updateCourseZodSchema = z.object({
  params: idParamsValidator,

  body: courseBodySchema
    .partial()
    .strict()
    .refine((data) => Object.keys(data).length > 0, {
      message: 'You must provide at least one field to update',
      path: ['body'],
    }),
});

exports.deleteCourseZodSchema = z.object({
  params: idParamsValidator,
});

exports.answersSchema = z.object({
  body: z.object({
    answers: z
      .array(
        z.coerce
          .number()
          .int()
          .nonnegative({ message: 'Answers must be non-negative integers' })
          .max(4, { message: 'Each answer must be less than or equal to 4' }),
      )
      .length(15, { message: 'You must provide exactly 15 answers' }),
  }),
});
