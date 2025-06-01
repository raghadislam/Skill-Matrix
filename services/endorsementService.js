const ApiFeatures = require('../utils/apiFeatures');
const Endorsement = require('../models/endorsementModel');
const User = require('../models/userModel');
const Skill = require('../models/skillModel');

class EndorsementService {
  #population(query) {
    query.populate({
      path: 'skillId',
      select: 'name category',
    });

    query.populate({
      path: 'endorserId',
      select: 'name email department',
    });

    query.populate({
      path: 'endorseeId',
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

  async endors(endorserId, endorseeId, skillId) {
    const endorsee = await User.findById(endorseeId);
    if (!endorsee) return undefined;

    const skill = await Skill.findById(skillId);
    if (!skill) return undefined;

    const skillExists = endorsee.skills.some(
      (id) => id.toString() === skillId.toString(),
    );

    if (!skillExists) {
      endorsee.skills.push(skillId);
      await endorsee.save();
    }

    const endorsement = await Endorsement.create({
      skillId,
      endorserId,
      endorseeId,
    });

    return await endorsement.populate([
      { path: 'skillId', select: 'name' },
      { path: 'endorserId', select: 'name' },
      { path: 'endorseeId', select: 'name' },
    ]);
  }
}

module.exports = new EndorsementService();
