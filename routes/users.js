const router = require('express').Router();
const { celebrate } = require('celebrate');
const Joi = require('joi');
const {
  getUsers,
  updateUser,
  updateAvatar,
  getUser,
  // addUser,
  getCurrentUser,
} = require('../controllers/users');

const celebrateUpdateUser = () => celebrate({
  body: Joi.object().keys({
    name: Joi.string().min(2).max(30),
    about: Joi.string().min(2).max(30),
  }),
});

function celebrateUpdateAvatar() {
  return celebrate({
    body: Joi.object().keys({
      avatar: Joi.string().required().pattern(/^(https?:\/\/)?([\w-]{1,32}\.[\w-]{1,32})[^\s@]*#?$/),
    }),
  });
}

function celebrateParams() {
  return celebrate({
    params: Joi.object().keys({
      cardId: Joi.string().alphanum().length(24)
    })
  })
}

router.get('/me', getCurrentUser);
router.get('/', getUsers);
// router.post('/', addUser);
router.get('/:userId',celebrateParams(), getUser);
router.patch('/me', celebrateUpdateUser(), updateUser);
router.patch('/me/avatar', celebrateUpdateAvatar(), updateAvatar);

module.exports = router;
