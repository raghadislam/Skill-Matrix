const ApiFeatures = require('../utils/apiFeatures');
const Endorsement = require('../models/endorsementModel');

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
}

module.exports = new EndorsementService();
