const { z } = require('zod');
const mongoose = require('mongoose');
const DEPT = require('../utils/departments');

const objectId = z
  .string()
  .refine((val) => mongoose.Types.ObjectId.isValid(val), {
    message: 'Invalid ObjectId',
  });

const skillZodSchema = z.object({
  body: z.object({
    name: z.string().min(1, 'A skill must have a name'),
    description: z.string().optional(),
    parentSkillId: z.array(objectId).optional(),
    category: z.enum([DEPT.DEVELOPMENT, DEPT.DESIGN, DEPT.MARKETING], {
      errorMap: () => ({
        message: `Category must be either "${DEPT.DEVELOPMENT}", "${DEPT.DESIGN}" or "${DEPT.MARKETING}"`,
      }),
    }),
  }),
});

const updateSkillZodSchema = z.object({
  body: skillZodSchema.shape.body.partial(),
});

module.exports = {
  skillZodSchema,
  updateSkillZodSchema,
};
