const express = require('express');
const cookieParser = require('cookie-parser');

const globalErrorHandler = require('./middlewares/globalErrorHandler');
const userRouter = require('./routes/userRoutes');
const skillRouter = require('./routes/skillRoutes');
const courseRouter = require('./routes/courseRoutes');

const app = express();

app.use(express.json());
app.use(cookieParser());

app.use('/api/v1/users', userRouter);
app.use('/api/v1/skills', skillRouter);
app.use('/api/v1/courses', courseRouter);

app.use(globalErrorHandler);

module.exports = app;
