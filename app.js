const express = require('express');
const cookieParser = require('cookie-parser');

const userRouter = require('./routes/userRoutes');
const globalErrorHandler = require('./middlewares/globalErrorHandler');

const app = express();

app.use(express.json());
app.use(cookieParser());

app.use('/api/v1/users', userRouter);

app.use(globalErrorHandler);

module.exports = app;
