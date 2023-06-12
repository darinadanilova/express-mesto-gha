const User = require('../models/user');
const {
  BAD_REQUEST,
  NOT_FOUND,
  SERVER_ERROR,
} = require('../utils/errors');

const getUsers = (req, res) => {
  User.find({})
    .then((users) => res.send({ data: users }))
    .catch((err) => {
      res.status(SERVER_ERROR).send({ message: 'Ошибка сервера', err: err.message, stack: err.stack });
    });
};

const getUserById = (req, res) => {
  User.findById(req.params.userId)
    .orFail(() => new Error('Not found'))
    .then((user) => res.send({ data: user }))
    .catch((err) => {
      if (err.message === 'Not found') {
        res
          .status(NOT_FOUND)
          .send({
            message: 'Пользователь не найден',
          });
      } else if (err.name === 'CastError') {
        res
          .status(BAD_REQUEST)
          .send({
            message: 'Вы ввели некорректные данные',
          });
      } else {
        res
          .status(SERVER_ERROR)
          .send({
            message: 'Ошибка сервера',
            err: err.message,
            stack: err.stack,
          });
      }
    });
};

const createUser = (req, res) => {
  const { name, about, avatar } = req.body;
  User.create({ name, about, avatar })
    .then((user) => res.status(201).send({ data: user }))
    .catch((err) => {
      if (err.name === 'ValidationError') {
        res
          .status(BAD_REQUEST)
          .send({
            message: 'Вы ввели некорректные данные',
          });
      } else {
        res
          .status(SERVER_ERROR)
          .send({
            message: 'Ошибка сервера',
            err: err.message,
            stack: err.stack,
          });
      }
    });
};

const patchUser = (req, res) => {
  const { name, about } = req.body;
  User.findByIdAndUpdate(req.user._id, { name, about }, { new: true, runValidators: true })
    .orFail(() => new Error('Not found'))
    .then((user) => res.send({ data: user }))
    .catch((err) => {
      if (err.name === 'ValidationError') {
        res
          .status(BAD_REQUEST)
          .send({
            message: 'Вы ввели некорректные данные',
          });
      } else if (err.name === 'CastError') {
        res
          .status(BAD_REQUEST)
          .send({
            message: 'Вы ввели некорректные данные',
          });
      } else if (err.name === 'Not found') {
        res
          .status(NOT_FOUND)
          .send({
            message: 'Пользователь не найден',
          });
      } else {
        res
          .status(SERVER_ERROR)
          .send({
            message: 'Ошибка сервера',
            err: err.message,
            stack: err.stack,
          });
      }
    });
};

const patchAvatar = (req, res) => {
  const { avatar } = req.body;
  User.findByIdAndUpdate(req.user._id, { avatar }, { new: true, runValidators: true })
    .orFail(() => new Error('Not found'))
    .then((user) => res.send({ data: user }))
    .catch((err) => {
      if (err.name === 'ValidationError') {
        res
          .status(BAD_REQUEST)
          .send({
            message: 'Вы ввели некорректные данные',
          });
      } else if (err.name === 'CastError') {
        res
          .status(BAD_REQUEST)
          .send({
            message: 'Вы ввели некорректные данные',
          });
      } else if (err.name === 'Not found') {
        res
          .status(NOT_FOUND)
          .send({
            message: 'Пользователь не найден',
          });
      } else {
        res
          .status(SERVER_ERROR)
          .send({
            message: 'Ошибка сервера',
            err: err.message,
            stack: err.stack,
          });
      }
    });
};

module.exports = {
  getUsers,
  getUserById,
  createUser,
  patchUser,
  patchAvatar,
};
