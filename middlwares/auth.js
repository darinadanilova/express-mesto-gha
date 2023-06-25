/* eslint-disable consistent-return */
const jwt = require('jsonwebtoken');
require('dotenv').config();
const { SECRET_KEY } = require('../utils/config');
const UnauthorizedError = require('../errors/UnauthorizedError');

const auth = (req, res, next) => {
  const token = req.cookies.jwt;
  let payload;
  try {
    payload = jwt.verify(token, SECRET_KEY);
  } catch (err) {
    next(new UnauthorizedError('Вы ввели неверные email и пароль'));
  }

  req.user = payload;
  next();
};

module.exports = auth;
