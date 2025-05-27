const { z } = require('zod');
const mongoose = require('mongoose');

const idParamsValidator = z.object({
  id: z.string().refine((val) => mongoose.Types.ObjectId.isValid(val), {
    message: 'Invalid ObjectId format',
  }),
});

module.exports = idParamsValidator;
