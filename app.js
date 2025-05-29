const express = require('express');
const cookieParser = require('cookie-parser');

const globalErrorHandler = require('./middlewares/globalErrorHandler');
const userRouter = require('./routes/userRoutes');
const authRouter = require('./routes/authRoutes');
const skillRouter = require('./routes/skillRoutes');
const courseRouter = require('./routes/courseRoutes');
const pathRouter = require('./routes/learningPathRoutes');
const assessmentRouter = require('./routes/assessmentRoutes');

const app = express();

app.use(express.json());
app.use(cookieParser());

app.use('/api/v1/users', userRouter);
app.use('/api/v1/auth', authRouter);
app.use('/api/v1/skills', skillRouter);
app.use('/api/v1/courses', courseRouter);
app.use('/api/v1/learning-paths', pathRouter);
app.use('/api/v1/assessments', assessmentRouter);

app.use(globalErrorHandler);

module.exports = app;
