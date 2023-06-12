const Card = require('../models/card');
const {
  BAD_REQUEST,
  NOT_FOUND,
  SERVER_ERROR,
} = require('../utils/errors');

const getCards = (req, res) => {
  Card.find({})
    .then((cards) => res.send(cards))
    .catch((err) => {
      res.status(SERVER_ERROR).send({ message: 'Ошибка сервера', err: err.message, stack: err.stack });
    });
};

const createCard = (req, res) => {
  Card.create({
    ...req.body,
    owner: req.user._id,
  })
    .then((card) => res.status(201).send({ data: card }))
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

const deleteCardId = (req, res) => {
  Card.findByIdAndRemove(req.params.cardId)
    .orFail(() => new Error('Not found'))
    .then((card) => res.send({ data: card }))
    .catch((err) => {
      if (err.name === 'CastError') {
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

const putLikeCard = (req, res) => {
  Card.findByIdAndUpdate(req.params.cardId, { $addToSet: { likes: req.user._id } }, { new: true })
    .orFail(() => new Error('Not found'))
    .then((card) => res.status(200).send({ data: card }))
    .catch((err) => {
      if (err.name === 'CastError') {
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

const deleteLikeCard = (req, res) => {
  Card.findByIdAndUpdate(req.params.cardId, { $pull: { likes: req.user._id } }, { new: true })
    .orFail(() => new Error('Not found'))
    .then((card) => res.status(200).send({ data: card }))
    .catch((err) => {
      if (err.name === 'CastError') {
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
  getCards,
  createCard,
  deleteCardId,
  putLikeCard,
  deleteLikeCard,
};
