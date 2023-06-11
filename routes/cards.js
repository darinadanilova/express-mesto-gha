const router = require('express').Router();
const {
  getCards, createCard, deleteCardId, putLikeCard, deleteLikeCard,
} = require('../controllers/cards');

router.get('/', getCards);

router.post('/', createCard);

router.delete('/:id', deleteCardId);

router.put('/:id', putLikeCard);

router.delete('/:id', deleteLikeCard);

module.exports = router;
