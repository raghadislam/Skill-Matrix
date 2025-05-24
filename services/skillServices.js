const Skill = require('../models/skillModel');
const APIFeatures = require('../utils/apiFeatures');

class SkillService {
  async getAllSkills(queryString) {
    const feature = new APIFeatures(Skill.find(), queryString)
      .filter()
      .sort()
      .limitFields()
      .paginate();

    return await feature.query.lean();
  }

  async createSkill(data) {
    return await Skill.create(data);
  }

  async updateSkill(id, data) {
    return await Skill.findByIdAndUpdate(id, data, {
      new: true,
      runValidators: true,
    });
  }

  async deleteSkill(id) {
    return await Skill.findByIdAndDelete(id);
  }
}

module.exports = SkillService;
