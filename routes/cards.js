const router = require('express').Router();
const {
  getCards,
  createCard,
  deleteCard,
  likeCard,
  dislikeCard,
} = require('../controllers/cards');
const { celebrateCreateCard, celebrateParams } = require('../utils/validation');

router.post('/', celebrateCreateCard(), createCard);
router.get('/', getCards);
router.delete('/:cardId', celebrateParams(), deleteCard);
router.put('/:cardId/likes', celebrateParams(), likeCard);
router.delete('/:cardId/likes', celebrateParams(), dislikeCard);

module.exports = router;
