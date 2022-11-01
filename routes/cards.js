const router = require('express').Router();
const { celebrate } = require('celebrate');
const Joi = require('joi');
const {
  getCards,
  createCard,
  deleteCard,
  likeCard,
  dislikeCard,
} = require('../controllers/cards');

function celebrateCreateCard() {
  return celebrate({
    body: Joi.object().keys({
      name: Joi.string().required().min(2).max(30),
      link: Joi.string().required().pattern(/^(https?:\/\/)?([\w-]{1,32}\.[\w-]{1,32})[^\s@]*#?$/),
    }),
  });
}

function celebrateParams() {
  return celebrate({
    params: Joi.object().keys({
      cardId: Joi.string().alphanum().length(24),
    }),
  });
}

router.post('/', celebrateCreateCard(), createCard);
router.get('/', getCards);
router.delete('/:cardId', celebrateParams(), deleteCard);
router.put('/:cardId/likes', celebrateParams(), likeCard);
router.delete('/:cardId/likes', celebrateParams(), dislikeCard);

module.exports = router;
