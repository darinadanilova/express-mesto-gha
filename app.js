/* eslint-disable import/no-extraneous-dependencies */
require('dotenv').config();
const express = require('express');
const mongoose = require('mongoose');
const bodyParser = require('body-parser');
const { errors } = require('celebrate');
const validator = require('validator');
const jsonWebToken = require('jsonwebtoken');
const bcrypt = require('bcryptjs');
const cookieParser = require('cookie-parser');
const auth = require('./middlwares/auth');
const error = require('./middlwares/error');
const router = require('./routes');
const {
  PORT,
  MONGODB,
} = require('./utils/config');
const errorHandler = require('./middlwares/error');

const app = express();

mongoose.connect(MONGODB, {
  useNewUrlParser: true,
});

app.use(express.json());

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));
app.use(cookieParser());

app.use(auth);

app.use(router);

app.use(errors());
app.use(error);

app.listen(PORT, () => {
  // eslint-disable-next-line no-console
  console.log('Слушаю порт 3000');
});
