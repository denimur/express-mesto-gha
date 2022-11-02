const { celebrate } = require('celebrate');
const Joi = require('joi');

function celebrateUpdateUser() {
  return celebrate({
    body: Joi.object().keys({
      name: Joi.string().min(2).max(30),
      about: Joi.string().min(2).max(30),
    }),
  });
}

function celebrateUpdateAvatar() {
  return celebrate({
    body: Joi.object().keys({
      avatar: Joi.string().required().pattern(/^(https?:\/\/)?([\w-]{1,32}\.[\w-]{1,32})[^\s@]*#?$/),
    }),
  });
}

function celebrateUserParams() {
  return celebrate({
    params: Joi.object().keys({
      userId: Joi.string().alphanum().length(24),
    }),
  });
}

function celebrateCardParams() {
  return celebrate({
    params: Joi.object().keys({
      cardId: Joi.string().alphanum().length(24),
    }),
  });
}

function celebrateCreateCard() {
  return celebrate({
    body: Joi.object().keys({
      name: Joi.string().required().min(2).max(30),
      link: Joi.string().required().pattern(/^(https?:\/\/)?([\w-]{1,32}\.[\w-]{1,32})[^\s@]*#?$/),
    }),
  });
}

module.exports = {
  celebrateUpdateUser,
  celebrateUpdateAvatar,
  celebrateUserParams,
  celebrateCreateCard,
  celebrateCardParams,
};
