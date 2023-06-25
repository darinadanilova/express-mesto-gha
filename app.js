/* eslint-disable import/no-extraneous-dependencies */
require('dotenv').config();
const express = require('express');
const rateLimit = require('express-rate-limit');
const mongoose = require('mongoose');
const { errors } = require('celebrate');
const cookieParser = require('cookie-parser');
const helmet = require('helmet');
const router = require('./routes');
const {
  PORT,
  MONGODB,
} = require('./utils/config');
const errorHandler = require('./middlwares/error');

const app = express();
app.use(express.json());
const limiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  max: 100,
  standardHeaders: true,
  legacyHeaders: false,
});

app.use(limiter);
app.use(helmet());

mongoose.connect(MONGODB, {
  useNewUrlParser: true,
});

app.use(cookieParser());

app.use(router);

app.use(errors());
app.use(errorHandler);

app.listen(PORT, () => {
  // eslint-disable-next-line no-console
  console.log('Слушаю порт 3000');
});
