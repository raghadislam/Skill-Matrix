const AssessmentRequest = require('../models/assessmentRequestModel');
const User = require('../models/userModel');
const Assessment = require('../models/assessmentModel');
const ApiFeatures = require('../utils/apiFeatures');
const AppError = require('../utils/appError');

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
    if (!(await User.exists({ _id: data.user })))
      throw new AppError(`No user found with that ID`, 404);

    if (!(await Assessment.exists({ _id: data.assessment })))
      throw new AppError(`No assessment found with that ID`, 404);

    return await AssessmentRequest.create(data);
  }
}

module.exports = new AssessmentRequestService();
