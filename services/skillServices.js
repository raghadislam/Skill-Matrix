const Skill = require('../models/skillModel');

class SkillService {
  async getAllSkills() {
    return await Skill.find().select('-__v');
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
