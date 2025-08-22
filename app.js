const express = require('express');
const cookieParser = require('cookie-parser');

const globalErrorHandler = require('./middlewares/globalErrorHandler');
const userRouter = require('./routes/user.routes');
const authRouter = require('./routes/auth.routes');
const skillRouter = require('./routes/skill.routes');
const courseRouter = require('./routes/course.routes');
const pathRouter = require('./routes/learningPath.routes');
const assessmentRouter = require('./routes/assessment.routes');
const enrollmentRouter = require('./routes/enrollment.routes');
const assessmentRequestRouter = require('./routes/assessmentRequests.routes');
const notificationRouter = require('./routes/notification.routes');
const endorsementRouter = require('./routes/endorsement.routes');
const reportRouter = require('./routes/report.routes');

const app = express();

app.use(express.json());
app.use(cookieParser());

app.use('/api/v1/users', userRouter);
app.use('/api/v1/auth', authRouter);
app.use('/api/v1/skills', skillRouter);
app.use('/api/v1/courses', courseRouter);
app.use('/api/v1/learning-paths', pathRouter);
app.use('/api/v1/assessments', assessmentRouter);
app.use('/api/v1/enrollments', enrollmentRouter);
app.use('/api/v1/assessment-requests', assessmentRequestRouter);
app.use('/api/v1/notifications', notificationRouter);
app.use('/api/v1/endorsements', endorsementRouter);
app.use('/api/v1/reports', reportRouter);

app.use(globalErrorHandler);

module.exports = app;
