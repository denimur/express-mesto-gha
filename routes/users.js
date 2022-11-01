const router = require('express').Router();
const { celebrate } = require('celebrate');
const Joi = require('joi');
const {
  getUsers,
  updateUser,
  updateAvatar,
  getUser,
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
      avatar: Joi.string().required(),
    }),
  });
}

router.get('/me', getCurrentUser);
router.get('/', getUsers);
router.get('/:userId', getUser);
router.patch('/me', celebrateUpdateUser(), updateUser);
router.patch('/me/avatar', celebrateUpdateAvatar(), updateAvatar);

module.exports = router;
