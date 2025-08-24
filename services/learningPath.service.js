const LearningPath = require('../models/learningPath.model');
const APIFeatures = require('../utils/apiFeatures');
const AppError = require('../utils/appError');
const Course = require('../models/course.model');
const Enrollment = require('../models/enrollment.model');
const enrollmentService = require('./enrollment.service');
const { STATUS } = require('../utils/enums');

class LearningPathService {
  async getAllLearningPaths(queryString) {
    const feature = new APIFeatures(LearningPath.find(), queryString)
      .filter()
      .sort()
      .limitFields()
      .paginate();

    return await feature.query.lean();
  }

  async getLearningPath(id) {
    return await LearningPath.findById(id).lean();
  }

  async createLearningPath(data) {
    const path = await LearningPath.create(data);
    return path.populate({
      path: 'orderedCourses',
      select: '-prerequisites',
    });
  }

  async updateLearningPath(id, data) {
    const query = LearningPath.findByIdAndUpdate(id, data, {
      new: true,
      runValidators: true,
    });
    return await query.lean();
  }

  async deleteLearningPath(id) {
    return await LearningPath.findByIdAndDelete(id);
  }

  async autoEnroll(pathId, user, mode) {
    const learningPath = await LearningPath.findById(pathId).populate({
      path: 'orderedCourses',
      model: 'Course',
    });

    if (!learningPath)
      throw new AppError('No learning path found with that ID', 404);
    const userSkillSet = new Set((user.skills || []).map((s) => s.toString()));

    // get user's enrollments (only course + status)
    const enrollmentsOfUser = await Enrollment.find(
      { user: user._id },
      'course status',
    ).lean();

    const completedCourseIds = new Set(
      enrollmentsOfUser
        .filter((e) => e.status === STATUS.COMPLETED && e.course)
        .map((e) => String(e.course)),
    );

    // first course in path that user hasn't completed
    const targetCourse =
      (learningPath.orderedCourses || []).find(
        (course) => !completedCourseIds.has(String(course._id)),
      ) || null;

    if (!targetCourse) {
      return {
        message: 'User has enrollments for all courses in this learning path',
      };
    }

    // prerequisites as strings
    const prereqSkills = (targetCourse.prerequisites || []).map((s) =>
      s.toString(),
    );

    const missingSkills = prereqSkills.filter((s) => !userSkillSet.has(s));

    if (missingSkills.length === 0) {
      // user meets prerequisites -> enroll in target course
      if (mode === 'warn') {
        return {
          data: {
            targetCourse: { id: targetCourse._id, title: targetCourse.title },
          },
          message: 'User meets prerequisites for the target course.',
        };
      }

      // avoid creating duplicate enrollment: check any existing enrollment for this course
      const existing = enrollmentsOfUser.find(
        (e) => e.course && e.course.toString() === targetCourse._id.toString(),
      );

      if (existing) {
        // handle different states explicitly
        if (existing.status === STATUS.IN_PROGRESS) {
          return {
            data: {
              targetCourse: { id: targetCourse._id, title: targetCourse.title },
            },
            message:
              'User already enrolled in the target course but still in progress.',
          };
        }
        if (existing.status === STATUS.COMPLETED) {
          return {
            data: {
              targetCourse: { id: targetCourse._id, title: targetCourse.title },
            },
            message: 'User already completed the target course.',
          };
        }
        // other statuses (PENDING, CANCELLED, etc.) — return without creating duplicate
        return {
          data: {
            targetCourse: { id: targetCourse._id, title: targetCourse.title },
            status: existing.status,
          },
          message: `User already has an enrollment for the target course with status ${existing.status}.`,
        };
      }

      try {
        const enrollment = await enrollmentService.enroll(
          targetCourse._id,
          user._id,
        );
        return {
          data: {
            targetCourse: { id: targetCourse._id, title: targetCourse.title },
            enrollment,
          },
          message: 'User has been enrolled in the target course.',
        };
      } catch (err) {
        // handle duplicate key error if unique index on (user, course) exists
        if (err.code === 11000) {
          return {
            data: {
              targetCourse: { id: targetCourse._id, title: targetCourse.title },
            },
            message: 'Enrollment already exists int the target course.',
          };
        }
        throw err;
      }
    }

    // missing prerequisites -> find courses that grant missing skills
    const pathCourseIds = (learningPath.orderedCourses || []).map((c) => c._id);

    // Normalize missingSkills to ObjectId strings; skillGained in DB might be ObjectIds -
    // so search either by ObjectId or string; simplest: convert DB fields to strings when scoring
    let candidates = await Course.find({
      _id: { $in: pathCourseIds },
      skillGained: { $in: missingSkills }, // this works if skillGained stores ids that equal missingSkills strings; otherwise broadened search next
    }).lean();

    if (candidates.length === 0) {
      candidates = await Course.find({ skillGained: { $in: missingSkills } })
        .limit(10)
        .lean();
    }

    if (candidates.length === 0) {
      return {
        data: { missingSkills },
        message:
          'Missing prerequisite skills and no available course found that grants them.',
      };
    }

    // score candidates: cover count + duration (use numeric default for duration)
    const candidateScores = candidates.map((c) => {
      const gains = (c.skillGained || []).map((s) => s.toString());
      const covers = missingSkills.filter((ms) => gains.includes(ms)).length;
      const duration = Number.isFinite(Number(c.durationHours))
        ? Number(c.durationHours)
        : Number.POSITIVE_INFINITY;
      return { course: c, covers, duration };
    });

    candidateScores.sort((a, b) => {
      if (b.covers !== a.covers) return b.covers - a.covers;
      return a.duration - b.duration;
    });

    const best = candidateScores[0];
    if (!best) {
      return {
        data: { missingSkills },
        message: 'No suitable prerequisite candidate found.',
      };
    }
    const chosen = best.course;

    if (mode === 'warn') {
      return {
        data: {
          targetCourse: { id: targetCourse._id, title: targetCourse.title },
          prerequisiteCourse: {
            id: chosen._id,
            title: chosen.title,
            covers: best.covers,
          },
          missingSkills,
        },
        message:
          'User is missing prerequisites. Suggested prerequisite course returned (warn mode).',
      };
    }

    // enroll in prerequisite course (avoid duplicates)
    const alreadyEnrolled = enrollmentsOfUser.find(
      (e) => e.course && e.course.toString() === chosen._id.toString(),
    );

    if (alreadyEnrolled) {
      return {
        data: {
          prerequisiteCourse: { id: chosen._id, title: chosen.title },
          status: alreadyEnrolled.status,
        },
        message: 'User already enrolled in the prerequisite course.',
      };
    }

    try {
      const enrollment = await enrollmentService.enroll(chosen._id, user._id);
      return {
        data: {
          prerequisiteCourse: { id: chosen._id, title: chosen.title },
          enrollment,
          missingSkills,
          targetCourse: { id: targetCourse._id, title: targetCourse.title },
        },
        message:
          'User has been enrolled in a prerequisite course. They will need to complete it before moving to the target course.',
      };
    } catch (err) {
      if (err.code === 11000) {
        return {
          data: { prerequisiteCourse: { id: chosen._id, title: chosen.title } },
          message: 'Enrollment already exists in the prerequisite.',
        };
      }
      throw err;
    }
  }
}

module.exports = new LearningPathService();
