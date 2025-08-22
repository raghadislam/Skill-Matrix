const fs = require('fs');
const dotenv = require('dotenv');
const mongoose = require('mongoose');
const Skill = require('../../models/skill.model');
const User = require('../../models/user.model');
const Course = require('../../models/course.model');
const Path = require('../../models/learningPath.model');
const Assessment = require('../../models/assessment.model');
const AssessmentRequest = require('../../models/assessmentRequest.model');
const Notification = require('../../models/notification.model');
const Question = require('../../models/question.model');
const Badge = require('../../models/badge.model');

dotenv.config({ path: './config.env' });

const DB = process.env.DATABASE.replace(
  '<PASSWORD>',
  process.env.DATABASE_PASSWORD,
);

mongoose.connect(DB).then(() => {
  console.log('DB connection successful!');
});

const skills = JSON.parse(fs.readFileSync(`${__dirname}/skills.json`));
const users = JSON.parse(fs.readFileSync(`${__dirname}/users.json`));
const courses = JSON.parse(fs.readFileSync(`${__dirname}/courses.json`));
const paths = JSON.parse(fs.readFileSync(`${__dirname}/learningPaths.json`));
const questions = JSON.parse(fs.readFileSync(`${__dirname}/questions.json`));
const assessments = JSON.parse(
  fs.readFileSync(`${__dirname}/assessments.json`),
);
const assessmentRequests = JSON.parse(
  fs.readFileSync(`${__dirname}/assessmentRequests.json`),
);
const notifications = JSON.parse(
  fs.readFileSync(`${__dirname}/notifications.json`),
);
const badges = JSON.parse(fs.readFileSync(`${__dirname}/badges.json`));

const importData = async () => {
  try {
    await Skill.create(skills);
    await User.create(users);
    await Course.create(courses);
    await Path.create(paths);
    await Question.create(questions);
    await Assessment.create(assessments);
    await AssessmentRequest.create(assessmentRequests);
    await Notification.create(notifications);
    await Badge.create(badges);

    console.log('Data successfully loaded!');
    process.exit();
  } catch (err) {
    console.log('ERROR');

    console.log(err);
  }
};

const deleteData = async () => {
  try {
    await Skill.deleteMany();
    await User.deleteMany();
    await Course.deleteMany();
    await Path.deleteMany();
    await Assessment.deleteMany();
    await AssessmentRequest.deleteMany();
    await Notification.deleteMany();
    await Question.deleteMany();
    await Badge.deleteMany();

    console.log('Data successfully deleted!');
    process.exit();
  } catch (err) {
    console.log(err);
  }
};

if (process.argv[2] === '--import') {
  importData();
} else if (process.argv[2] === '--delete') {
  deleteData();
}
