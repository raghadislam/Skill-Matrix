const { z } = require('zod');

const idParamsValidator = z.object({
  id: z.string().regex(/^[0-9a-fA-F]{24}$/, 'Invalid user ID format'),
});

module.exports = idParamsValidator;
