const ApiFeatures = require('../utils/apiFeatures');
const Endorsement = require('../models/endorsement.model');
const User = require('../models/user.model');
const Skill = require('../models/skill.model');

class EndorsementService {
  #population(query) {
    query.populate([
      { path: 'skill', select: 'name' },
      { path: 'endorser', select: 'name' },
      { path: 'endorsee', select: 'name' },
    ]);

    query.populate({
      path: 'endorser',
      select: 'name email department',
    });

    query.populate({
      path: 'endorsee',
      select: 'name email department',
    });
    return query;
  }

  async getAllEndorsements(queryString) {
    const query = this.#population(Endorsement.find());
    const feature = new ApiFeatures(query, queryString)
      .filter()
      .sort()
      .limitFields()
      .paginate();

    return await feature.query.lean();
  }

  async getEndorsement(id) {
    const query = this.#population(Endorsement.findById(id));
    return await query.lean();
  }

  async updateEndorsement(id, data) {
    let query = Endorsement.findByIdAndUpdate(id, data, {
      new: true,
      runValidators: true,
    });
    query = this.#population(query);

    return await query.lean();
  }

  async deleteEndorsement(id) {
    return await Endorsement.findByIdAndDelete(id);
  }

  async endors(endorser, endorsee, skill) {
    const endorseeQuery = await User.findById(endorsee);
    if (!endorseeQuery) return undefined;

    const skillQuery = await Skill.findById(skill);
    if (!skillQuery) return undefined;

    const skillExists = endorseeQuery.skills.some(
      (id) => id.toString() === skill.toString(),
    );

    if (!skillExists) {
      endorseeQuery.skills.push(skill);
      await endorseeQuery.save();
    }

    const endorsement = await Endorsement.create({
      skill,
      endorser,
      endorsee,
    });

    return await endorsement.populate([
      { path: 'skill', select: 'name' },
      { path: 'endorser', select: 'name' },
      { path: 'endorsee', select: 'name' },
    ]);
  }

  async getSkillsAndEndorsements(userId) {
    const user = await User.findOne({ _id: userId })
      .populate({
        path: 'skills',
        select: 'name',
      })
      .lean();
    if (!user) return undefined;

    const { skills } = user;

    const endorsement = await this.#population(
      Endorsement.find({ endorsee: userId }),
    ).lean();

    const data = {
      skills: skills,
      endorsement,
    };

    return data;
  }
}

module.exports = new EndorsementService();
