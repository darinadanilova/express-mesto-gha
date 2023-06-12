const router = require('express').Router();
const {
  getCards, createCard, deleteCardId, putLikeCard, deleteLikeCard,
} = require('../controllers/cards');

router.get('/', getCards);

router.post('/', createCard);

router.delete('/:cardId', deleteCardId);

router.put('/:cardId/likes', putLikeCard);

router.delete('/:cardId/likes', deleteLikeCard);

module.exports = router;
