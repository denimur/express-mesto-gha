const { default: mongoose } = require('mongoose');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const User = require('../models/user');
const { BadRequestError, NotFoundError, UnauthorizedError, ForbiddenError } = require('../utils/errors');
const { ok } = require('../utils/status');

module.exports.createUser = (req, res, next) => {
  const {
    name, about, avatar, email, password,
  } = req.body;

  if (!email || !password) {
    throw new BadRequestError('Переданы некорректные данные при создании пользователя.')
  }
  bcrypt.hash(password, 10)
    .then((hash) => User.create({
      name, about, avatar, email, password: hash,
    }))
    .then(({ name, about, avatar, email, _id }) => {
      res.status(ok).send({ data: { name, about, avatar, email, _id } })
    })
    .catch(next)
};

module.exports.getUsers = (req, res, next) => {
  User.find({})
    .then((data) => res.status(ok).send({ data }))
    .catch(next);
};

module.exports.getUser = (req, res, next) => {
  User.findById(req.params.userId)
    .orFail(new NotFoundError('Пользователь по указанному _id не найден.'))
    .then(user => {
      res.status(ok).send(user)
    })
    .catch(next)
}

module.exports.getCurrentUser = (req, res, next) => {
  User.findById(req.user._id)
    .orFail(new NotFoundError('Пользователь по указанному _id не найден.'))
    .then((user) => res.status(ok).send(user))
    .catch(next)
};

module.exports.updateUser = (req, res, next) => {
  const { name, about } = req.body;
  User.findByIdAndUpdate(
    req.user._id,
    { name, about },
    {
      new: true,
      runValidators: true
    },
  )
    .orFail(new NotFoundError('Пользователь по указанному _id не найден.'))
    .then((user) => res.status(ok).send(user))
    .catch(next);
};

module.exports.updateAvatar = (req, res, next) => {
  const { avatar } = req.body;
  User.findByIdAndUpdate(
    req.user._id,
    { avatar },
    { new: true, runValidators: true },
  )
    .orFail(new NotFoundError('Пользователь по указанному _id не найден.'))
    .then((user) => {
      if (req.user._id !== user._id.toString()) {
        throw new ForbiddenError('Можно редактировать только свой аватар.')
      }
      res.status(ok).send(user)
    })
    .catch(next);
};

module.exports.login = (req, res, next) => {
  const { email, password } = req.body;

  User.findUserByCredentials(email, password)
    .then((user) => {
      const token = jwt.sign({ _id: user._id }, 'mySecretKey', { expiresIn: '7d' });
      if (!token) {
        throw new UnauthorizedError('Передан недействительный токен.')
      }
      res
        .status(ok)
        .send({'token': token})
        // .cookie('token', token, {
        // maxAge: 3600000 * 24 * 7,
        // httpOnly: true
        // })
        // .end();
    })
    .catch(next);
};
