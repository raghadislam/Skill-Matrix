const mongoose = require('mongoose');

const Skill = require('../models/skillModel');
const SkillHistory = require('../models/skillHistoryModel');
const APIFeatures = require('../utils/apiFeatures');
const { HISTORY_TYPE } = require('../utils/enums');

class SkillService {
  #population(query) {
    return query.populate({
      path: 'parentSkill',
      select: '-__v -_id -parentSkill',
    });
  }

  async #recordHistory({ skill, actor, type, before, after, session }) {
    const payload = {
      skill,
      actor,
      type,
      before,
      after,
    };

    return SkillHistory.create([payload], { session });
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

  async createSkill(data, actor) {
    const session = await mongoose.startSession();
    let createdSkill;

    try {
      session.startTransaction();
      createdSkill = await new Skill(data).save({ session });

      await this.#recordHistory({
        skill: createdSkill._id,
        actor,
        type: HISTORY_TYPE.CREATE,
        before: null,
        after: createdSkill.toObject(),
        session,
      });

      await session.commitTransaction();
      session.endSession();
    } catch (err) {
      await session.abortTransaction();
      session.endSession();
      throw err;
    }

    return await this.getSkill(createdSkill._id);
  }

  async updateSkill(id, data, actor) {
    const before = await Skill.findById(id).lean();
    if (!before) return null;

    const session = await mongoose.startSession();
    let updatedSkill;

    try {
      session.startTransaction();
      updatedSkill = await Skill.findByIdAndUpdate(id, data, {
        new: true,
        runValidators: true,
        session,
      });

      await this.#recordHistory({
        skill: updatedSkill._id,
        actor,
        type: HISTORY_TYPE.UPDATE,
        before,
        after: updatedSkill.toObject(),
        session,
      });

      await session.commitTransaction();
      session.endSession();
    } catch (err) {
      await session.abortTransaction();
      session.endSession();
      throw err;
    }

    return await this.getSkill(updatedSkill._id);
  }

  async deleteSkill(id, actor) {
    const before = await Skill.findById(id).lean();
    if (!before) return null;

    const session = await mongoose.startSession();
    let deletedSkill;

    try {
      session.startTransaction();
      deletedSkill = await Skill.findByIdAndDelete(id, { session });

      await this.#recordHistory({
        skill: id,
        actor,
        type: HISTORY_TYPE.DELETE,
        before,
        after: null,
        session,
      });

      await session.commitTransaction();
      session.endSession();
    } catch (err) {
      await session.abortTransaction();
      session.endSession();
      throw err;
    }

    return deletedSkill;
  }

  async getSkill(id) {
    const query = this.#population(Skill.findById(id));
    return await query.lean();
  }
}

module.exports = new SkillService();
