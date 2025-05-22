const express = require('express');

const globalErrorHandler = require('./middlewares/globalErrorHandler');

const app = express();

app.use(globalErrorHandler);

module.exports = app;
