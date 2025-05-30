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
    .object(
      {
        user: objectId,

        assessment: objectId,
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

const updateRequestZodSchema = z.object({
  params: idParamsValidator,

  body: createRequestZodSchema.shape.body
    .partial()
    .strict()
    .refine((data) => Object.keys(data).length > 0, {
      message: 'You must provide at least one field to update',
      path: ['body'],
    }),
});

const deleteRequestZodSchema = z.object({
  params: idParamsValidator,
});

module.exports = {
  getAllRequestsZodSchema,
  getRequestZodSchema,
  createRequestZodSchema,
  updateRequestZodSchema,
  deleteRequestZodSchema,
};
