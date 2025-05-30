const AssessmentRequest = require('../models/assessmentRequestModel');
const ApiFeatures = require('../utils/apiFeatures');

class AssessmentRequestService {
  async getAllRequests(queryString) {
    const feature = new ApiFeatures(AssessmentRequest.find(), queryString)
      .filter()
      .sort()
      .limitFields()
      .paginate();

    return await feature.query.lean();
  }

  async getRequest(id) {
    return await AssessmentRequest.findById(id).lean();
  }

  async createRequest(data) {
    return await AssessmentRequest.create(data);
  }
}

module.exports = new AssessmentRequestService();
