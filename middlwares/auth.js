/* eslint-disable consistent-return */
const jwt = require('jsonwebtoken');
require('dotenv').config();
const {
  ERROR_UNAUTHORIZED,
} = require('../utils/errors');

const auth = (req, res, next) => {
  const token = req.cookies.jwt;
  let payload;
  try {
    payload = jwt.verify(token, process.env.JWT_SECRET);
  } catch (err) {
    return next(new ERROR_UNAUTHORIZED('Вы ввели неверные email и пароль'));
  }

  req.user = payload;
  next();
};

module.exports = auth;
