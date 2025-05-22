const { z } = require('zod');
const mongoose = require('mongoose');

const objectId = z
  .string()
  .refine((val) => mongoose.Types.ObjectId.isValid(val), {
    message: 'Invalid ObjectId',
  });

const skillZodSchema = z.object({
  name: z.string().min(1, 'A skill must have a name'),
  description: z.string().optional(),
  parentSkillId: z.array(objectId).optional(),
  category: z.enum(['Development', 'Design', 'Marketing']),
});

const updateSkillZodSchema = skillZodSchema.partial();

module.exports = {
  skillZodSchema,
  updateSkillZodSchema,
};
