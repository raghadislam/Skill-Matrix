const AssessmentRequest = require('../models/assessmentRequest.model');
const User = require('../models/user.model');
const Assessment = require('../models/assessment.model');
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
    const request = await AssessmentRequest.findById(id).lean();
    if (!request)
      throw new AppError(`No assessment request found with that ID`, 404);

    return request;
  }

  async createRequest(data) {
    if (!(await User.exists({ _id: data.user })))
      throw new AppError(`No user found with that ID`, 404);

    if (!(await Assessment.exists({ _id: data.assessment })))
      throw new AppError(`No assessment found with that ID`, 404);

    return await AssessmentRequest.create(data);
  }

  async updateRequest(id, data) {
    if (data.user && !(await User.exists({ _id: data.user })))
      throw new AppError(`No user found with that ID`, 404);

    if (data.assessment && !(await Assessment.exists({ _id: data.assessment })))
      throw new AppError(`No assessment found with that ID`, 404);

    const updatedRequest = await AssessmentRequest.findByIdAndUpdate(id, data);
    if (!updatedRequest)
      throw new AppError(`No assessment request found with that ID`, 404);

    return updatedRequest;
  }

  async deleteRequest(id) {
    const request = await AssessmentRequest.findByIdAndDelete(id);
    if (!request)
      throw new AppError(`No assessment request found with that ID`, 404);
  }
}

module.exports = new AssessmentRequestService();
