const z = require('zod');

const idParamsValidator = require('./idParamsValidator');
const queryZodSchema = require('./queryValidator');
const DEPT = require('../utils/departments');

const objectIdString = z
  .string()
  .regex(/^[0-9a-fA-F]{24}$/, 'Invalid MongoDB ObjectId');

const courseBodySchema = z.object(
  {
    title: z.string().nonempty({ message: 'A course must have a title' }),

    description: z
      .string()
      .nonempty({ message: 'Course must have a description' }),

    durationHours: z
      .number({ invalid_type_error: 'durationHours must be a number' })
      .min(0, { message: 'Duration must be a positive number' }),

    prerequisites: z.array(objectIdString).optional().default([]),

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
  body: courseBodySchema.partial().strict(),
});

exports.deleteCourseZodSchema = z.object({
  params: idParamsValidator,
});
