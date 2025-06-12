const Skill = require('../models/skillModel');
const APIFeatures = require('../utils/apiFeatures');

class SkillService {
  #population(query) {
    return query.populate({
      path: 'parentSkill',
      select: '-__v -_id -parentSkill',
    });
  }

  async getAllSkills(queryString) {
    const query = this.#population(Skill.find());
    const feature = new APIFeatures(query, queryString)
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
    let query = Skill.findByIdAndUpdate(id, data, {
      new: true,
      runValidators: true,
    });
    query = this.#population(query);

    return await query.lean();
  }

  async deleteSkill(id) {
    return await Skill.findByIdAndDelete(id);
  }

  async getSkill(id) {
    const query = this.#population(Skill.findById(id));
    return await query.lean();
  }
}

module.exports = new SkillService();
