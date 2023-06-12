const Card = require('../models/card');
const {
  ERROR_BAD_REQUEST,
  ERROR_NOT_FOUND,
  INTERNAL_SERVER_ERROR,
} = require('../utils/errors');

const createCard = (req, res) => {
  Card.create({
    ...req.body,
    owner: req.user._id,
  })
    .then((card) => res.status(201).send({ data: card }))
    .catch((err) => {
      if (err.name === 'ValidationError') {
        res
          .status(ERROR_BAD_REQUEST)
          .send({
            message: 'Вы ввели некорректные данные',
          });
      } else {
        res
          .status(INTERNAL_SERVER_ERROR)
          .send({
            message: 'Ошибка сервера',
            err: err.message,
            stack: err.stack,
          });
      }
    });
};

const getCards = (req, res) => {
  Card.find({})
    .then((cards) => res.send(cards))
    .catch((err) => {
      res
        .status(INTERNAL_SERVER_ERROR)
        .send({
          message: 'Ошибка сервера',
          err: err.message,
          stack: err.stack,
        });
    });
};

const deleteCardId = (req, res) => {
  Card.findByIdAndRemove(req.params.cardId)
    .orFail(() => new Error('Карта не найдена'))
    .then((card) => res.send({ data: card }))
    .catch((err) => {
      if (err.name === 'CastError') {
        res
          .status(ERROR_BAD_REQUEST)
          .send({
            message: 'Вы ввели некорректные данные',
          });
      } else if (err.message === 'Карта не найдена') {
        res
          .status(ERROR_NOT_FOUND)
          .send({
            message: 'Карта не найдена',
          });
      } else {
        res
          .status(INTERNAL_SERVER_ERROR)
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
    .orFail(() => new Error('Карта не найдена'))
    .then((card) => res.send({ data: card }))
    .catch((err) => {
      if (err.name === 'CastError') {
        res
          .status(ERROR_BAD_REQUEST)
          .send({
            message: 'Вы ввели некорректные данные',
          });
      } else if (err.message === 'Карта не найдена') {
        res
          .status(ERROR_NOT_FOUND)
          .send({
            message: 'Карта не найдена',
          });
      } else if (err.name === 'ValidationError') {
        res
          .status(ERROR_BAD_REQUEST)
          .send({
            message: 'Вы ввели некорректные данные',
          });
      } else {
        res
          .status(INTERNAL_SERVER_ERROR)
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
    .orFail(() => new Error('Карта не найдена'))
    .then((card) => res.send({ data: card }))
    .catch((err) => {
      if (err.name === 'CastError') {
        res
          .status(ERROR_BAD_REQUEST)
          .send({
            message: 'Вы ввели некорректные данные',
          });
      } else if (err.message === 'Карта не найдена') {
        res
          .status(ERROR_NOT_FOUND)
          .send({
            message: 'Карта не найдена',
          });
      } else if (err.name === 'ValidationError') {
        res
          .status(ERROR_BAD_REQUEST)
          .send({
            message: 'Вы ввели некорректные данные',
          });
      } else {
        res
          .status(INTERNAL_SERVER_ERROR)
          .send({
            message: 'Ошибка сервера',
            err: err.message,
            stack: err.stack,
          });
      }
    });
};

module.exports = {
  createCard,
  getCards,
  deleteCardId,
  putLikeCard,
  deleteLikeCard,
};
