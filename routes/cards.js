const router = require('express').Router();
const {
  getCards,
  createCard,
  deleteCard,
  likeCard,
  dislikeCard,
} = require('../controllers/cards');
const { celebrateCreateCard, celebrateCardParams } = require('../utils/validation');

router.post('/', celebrateCreateCard(), createCard);
router.get('/', getCards);
router.delete('/:cardId', celebrateCardParams(), deleteCard);
router.put('/:cardId/likes', celebrateCardParams(), likeCard);
router.delete('/:cardId/likes', celebrateCardParams(), dislikeCard);

module.exports = router;
