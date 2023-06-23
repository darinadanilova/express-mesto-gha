const Card = require('../models/card');
const {
  ERROR_BAD_REQUEST,
  ERROR_NOT_FOUND,
  ERROR_FORBIDDEN,
} = require('../utils/errors');

const createCard = (req, res, next) => {
  Card.create({
    ...req.body,
    owner: req.user._id,
  })
    .then((card) => res.status(201).send({ data: card }))
    .catch((err) => {
      if (err.name === 'ValidationError') {
        next(new ERROR_BAD_REQUEST('Вы ввели некорректные данные'));
      }
      next(err);
    });
};

const getCards = (req, res, next) => {
  Card.find({})
    .then((cards) => res.send(cards))
    .catch(next);
};

const deleteCardId = (req, res, next) => {
  Card.findByIdAndRemove(req.params.cardId)
    .orFail(() => new Error('Карта не найдена'))
    .then((card) => {
      if (card.owner.toString() === req.user._id) {
        Card.deleteOne(card)
          .then(() => res.send({ data: card }))
          .catch(next);
      } else {
        throw new ERROR_FORBIDDEN('Нет прав для удаления карточки другого пользователя');
      }
    })
    .catch(next);
};

const putLikeCard = (req, res, next) => {
  Card.findByIdAndUpdate(req.params.cardId, { $addToSet: { likes: req.user._id } }, { new: true })
    .orFail(() => new Error('Карта не найдена'))
    .then((card) => {
      if (card) return res.send({ data: card });
      throw new ERROR_NOT_FOUND('Карта не найдена');
    })
    .catch((err) => {
      if (err.name === 'CastError') {
        next(new ERROR_BAD_REQUEST('Вы ввели некорректные данные'));
        return;
      }
      next(err);
    });
};

const deleteLikeCard = (req, res, next) => {
  Card.findByIdAndUpdate(req.params.cardId, { $pull: { likes: req.user._id } }, { new: true })
    .orFail(() => new Error('Карта не найдена'))
    .then((card) => {
      if (card) return res.send({ data: card });
      throw new ERROR_NOT_FOUND('Карта не найдена');
    })
    .catch((err) => {
      if (err.name === 'CastError') {
        next(new ERROR_BAD_REQUEST('Вы ввели некорректные данные'));
        return;
      }
      next(err);
    });
};

module.exports = {
  createCard,
  getCards,
  deleteCardId,
  putLikeCard,
  deleteLikeCard,
};
