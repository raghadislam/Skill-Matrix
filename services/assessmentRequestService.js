const AssessmentRequest = require('../models/assessmentRequest');
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
}

module.exports = new AssessmentRequestService();
