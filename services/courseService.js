const ApiFeatures = require('../utils/apiFeatures');
const Course = require('../models/courseModel');

class CourseService {
  async getAllCourses(queryString) {
    const feature = new ApiFeatures(Course.find(), queryString)
      .filter()
      .sort()
      .limitFields()
      .paginate();

    let courses = await feature.query.lean();
    courses = courses.map((course) => {
      course.prerequisites = course.prerequisites.map((skill) => {
        const { parentSkillId, ...rest } = skill;
        return rest;
      });
      return course;
    });

    return courses;
  }
}

module.exports = new CourseService();
