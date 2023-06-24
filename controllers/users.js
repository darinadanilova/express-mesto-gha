const bcrypt = require('bcryptjs');
const jsonWebToken = require('jsonwebtoken');
const User = require('../models/user');
const {
  ERROR_BAD_REQUEST,
  ERROR_NOT_FOUND,
  ERROR_CONFLICT,
  ERROR_UNAUTHORIZED,
} = require('../utils/errors');

const createUser = (req, res, next) => {
  const {
    name, about, avatar, email, password,
  } = req.body;
  bcrypt.hash(password, 10)
    .then((hashedPassword) => User.create({
      name, about, avatar, email, password: hashedPassword,
    }))
    .then(() => res.status(201).send({
      name, about, avatar, email,
    }))
    .catch((err) => {
      if (err.code === 11000) {
        next(new ERROR_CONFLICT('Пользователь с данным email уже зарегистрирован'));
      } else if (err.name === 'ValidationError') {
        next(new ERROR_BAD_REQUEST('Вы ввели некорректные данные'));
      } else {
        next(err);
      }
    });
};

const login = (req, res, next) => {
  const { email, password } = req.body;
  return User.findOne({ email })
    .select('+password')
    .orFail(() => next(new ERROR_UNAUTHORIZED('Вы ввели неверные email и пароль')))
    .then((user) =>
      bcrypt.compare(password, user.password)
        .then((isValidUser) => {
          if (isValidUser) {
            return user;
          }
          return next(new ERROR_UNAUTHORIZED('Вы ввели неверные email и пароль'));
        }))
    .then((user) => {
      const jwt = jsonWebToken.sign({
        _id: user._id,
      }, process.env['JWT_SECRET'], { expiresIn: '7d' });
      res
       //.cookie('jwt', jwt, {
       //  maxAge: 3600000 * 24 * 7,
       //  httpOnly: true,
       //  sameSite: true,
       //})
        .send({ jwt });
    })
    .catch((err) => {
      if (err.name === 'ValidationError') {
        next(new ERROR_BAD_REQUEST('Вы ввели некорректные данные'));
        return;
      }
      next(err);
    });
};

const getUsers = (req, res, next) => {
  User.find({})
    .then((users) => res.send({ data: users }))
    .catch(next);
};

const getUserById = (req, res, next) => {
  User.findById(req.params.userId)
    .orFail(() => next(new ERROR_NOT_FOUND('Пользователь не найден')))
    .then((user) => res.send({ data: user }))
    .catch(next);
};

const getUser = (req, res, next) => {
  User.findById(req.params.userId)
    .then((users) => res.send({ data: users }))
    .catch(next);
};

const patchUser = (req, res, next) => {
  const { name, about } = req.body;
  User.findByIdAndUpdate(req.user._id, { name, about }, { new: true, runValidators: true })
    .then((users) => res.send({ data: users }))
    .catch((err) => {
      if (err.name === 'ValidationError') {
        next(new ERROR_BAD_REQUEST('Вы ввели некорректные данные'));
      } else {
        next(err);
      }
    });
};

const patchAvatar = (req, res, next) => {
  const { avatar } = req.body;
  User.findByIdAndUpdate(req.user._id, { avatar }, { new: true, runValidators: true })
    .then((users) => res.send({ data: users }))
    .catch((err) => {
      if (err.name === 'ValidationError') {
        next(new ERROR_BAD_REQUEST('Вы ввели некорректные данные'));
      } else {
        next(err);
      }
    });
};

module.exports = {
  createUser,
  login,
  getUsers,
  getUserById,
  getUser,
  patchUser,
  patchAvatar,
};
