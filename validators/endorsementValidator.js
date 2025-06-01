const z = require('zod');
const mongoose = require('mongoose');
const idParamsValidator = require('./idParamsValidator');
const queryZodSchema = require('./queryValidator');

const objectId = z
  .string()
  .refine((val) => mongoose.Types.ObjectId.isValid(val), {
    message: 'Invalid ObjectId format',
  });

const endorseSchema = z.object({
  body: z
    .object(
      {
        endorseeId: objectId,
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

const getAllEndorsementsZodSchema = z.object({
  query: queryZodSchema,
});

const getEndorsementZodSchema = z.object({
  params: idParamsValidator,
});

const updateEndorsementZodSchema = z.object({
  params: idParamsValidator,
});

const deleteEndorsementZodSchema = z.object({
  params: idParamsValidator,
});

module.exports = {
  endorseSchema,
  getAllEndorsementsZodSchema,
  getEndorsementZodSchema,
  updateEndorsementZodSchema,
  deleteEndorsementZodSchema,
};
