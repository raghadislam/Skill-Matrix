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
    parentSkill: z.array(objectId).optional(),
    category: z.enum([DEPT.DEVELOPMENT, DEPT.DESIGN, DEPT.MARKETING], {
      errorMap: () => ({
        message: `Category must be either "${DEPT.DEVELOPMENT}", "${DEPT.DESIGN}" or "${DEPT.MARKETING}"`,
      }),
    }),
  }),
});

const updateSkillZodSchema = z.object({
  body: skillZodSchema.shape.body
    .partial()
    .refine((data) => Object.keys(data).length > 0, {
      message: 'You must provide at least one field to update',
      path: ['body'],
    }),
});

module.exports = {
  skillZodSchema,
  updateSkillZodSchema,
};
