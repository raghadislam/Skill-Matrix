const z = require('zod');
const mongoose = require('mongoose');
const idParamsValidator = require('./idParamsValidator');
const queryZodSchema = require('./queryValidator');

const objectId = z
  .string()
  .refine((val) => mongoose.Types.ObjectId.isValid(val), {
    message: 'Invalid ObjectId format',
  });

const enrollSchema = z.object({
  body: z
    .object(
      {
        course: objectId,
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
    )
    .strict(),
});

const getAllEnrollmentsZodSchema = z.object({
  query: queryZodSchema,
});

const getEnrollmentZodSchema = z.object({
  params: idParamsValidator,
});

const updateEnrollmentZodSchema = z.object({
  params: idParamsValidator,
});

const deleteEnrollmentZodSchema = z.object({
  params: idParamsValidator,
});

module.exports = {
  enrollSchema,
  getAllEnrollmentsZodSchema,
  getEnrollmentZodSchema,
  updateEnrollmentZodSchema,
  deleteEnrollmentZodSchema,
};
