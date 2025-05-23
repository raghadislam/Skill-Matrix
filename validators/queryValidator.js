const { z } = require('zod');

const queryZodSchema = z.object({
  page: z.coerce.number().int().positive().optional(),

  limit: z.coerce.number().int().positive().max(100).optional(),

  sort: z
    .string()
    .transform((str) => str.split(',').join(' '))
    .optional(),

  fields: z
    .string()
    .transform((str) => str.split(',').join(' '))
    .optional(),
});

module.exports = queryZodSchema;
