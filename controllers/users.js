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
    .then((hashedPassword) => {
      User.create({
        name, about, avatar, email, password: hashedPassword,
      })
        .then((user) => res.status(201).send({ data: user }))
        .catch((err) => {
          if (err.code === 11000) {
            next(new ERROR_CONFLICT('Пользователь с данным email уже зарегистрирован'));
          } else if (err.name === 'ValidationError') {
            next(new ERROR_BAD_REQUEST('Вы ввели некорректные данные'));
          } else {
            next(err);
          }
        });
    });
};

const login = (req, res, next) => {
  const { email, password } = req.body;
  User.findOne({ email })
    .select('+password')
    .orFail(() => new Error('Not found'))
    .then((user) => {
      bcrypt.compare((password), user.password)
        .then((isValidUser) => {
          if (isValidUser) {
            const jwt = jsonWebToken.sign({
              _id: user._id,
            }, process.env.JWT_SECRET);
            res.cookie('jwt', jwt, {
              maxAge: 360000,
              httpOnly: true,
              sameSite: true,
            });
            res.send({ data: user.toJSON() });
          } else {
            next(new ERROR_UNAUTHORIZED('Вы ввели неверные email и пароль'));
          }
        });
    })
    .catch((err) => {
      if (err.name === 'ValidationError') {
        next(new ERROR_BAD_REQUEST('Вы ввели некорректные данные'));
      } else {
        next(err);
      }
    });
};

const getUsers = (req, res, next) => {
  User.find({})
    .then((users) => res.send({ data: users }))
    .catch(next);
};

const getUserById = (req, res, next) => {
  User.findById(req.params.userId)
    .orFail(() => new Error('Not found'))
    .then((user) => {
      if (user) return res.send({ data: user });
      throw new ERROR_NOT_FOUND('Пользователь не найден');
    })
    .catch((err) => {
      if (err.name === 'CastError') {
        next(new ERROR_BAD_REQUEST('Вы ввели некорректные данные'));
      } else {
        next(err);
      }
    });
};

const patchUser = (req, res, next) => {
  const { name, about } = req.body;
  User.findByIdAndUpdate(req.user._id, { name, about }, { new: true, runValidators: true })
    .orFail(() => new Error('Not found'))
    .then((user) => {
      if (user) return res.send({ data: user });
      throw new ERROR_NOT_FOUND('Пользователь не найден');
    })
    .catch((err) => {
      if (err.name === 'CastError') {
        next(new ERROR_BAD_REQUEST('Вы ввели некорректные данные'));
      } else {
        next(err);
      }
    });
};

const patchAvatar = (req, res, next) => {
  const { avatar } = req.body;
  User.findByIdAndUpdate(req.user._id, { avatar }, { new: true, runValidators: true })
    .orFail(() => new Error('Not found'))
    .then((user) => {
      if (user) return res.send({ data: user });
      throw new ERROR_NOT_FOUND('Пользователь не найден');
    })
    .catch((err) => {
      if (err.name === 'CastError') {
        next(new ERROR_BAD_REQUEST('Вы ввели некорректные данные'));
      } else {
        next(err);
      }
    });
};

module.exports = {
  createUser,
  getUsers,
  getUserById,
  patchUser,
  patchAvatar,
  login,
};
