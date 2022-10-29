const { default: mongoose } = require('mongoose');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const User = require('../models/user');
const { BadRequestError, NotFoundError, UnauthorizedError } = require('../utils/errors');
const { badRequest, notFound, unexpected } = require('../utils/status');

module.exports.createUser = (req, res, next) => {
  const {
    name, about, avatar, email, password,
  } = req.body;

  bcrypt.hash(password, 10)
    .then((hash) => User.create({
      name, about, avatar, email, password: hash,
    }))
    .then(user => {
      if (!user) {
        throw new BadRequestError('Переданы некорректные данные при создании пользователя.')
      }
      const { name, about, avatar, email, _id } = user;
      res.status(200).send({ data: { name, about, avatar, email, _id } })
    })
    .catch(next)
};

module.exports.getUsers = (req, res, next) => {
  User.find({})
    .then((data) => res.send({ data }))
    .catch(next);
};

module.exports.getUser = (req, res, next) => {
  User.findById(req.params.userId)
    .orFail(new NotFoundError('Пользователь по указанному _id не найден.'))
    .then(user => res.send(user))
    .catch(next)
}

module.exports.getCurrentUser = (req, res, next) => {
  User.findById(req.user._id)
    .orFail(new NotFoundError('Пользователь по указанному _id не найден.'))
    .then((user) => res.send(user))
    .catch(next)
};

module.exports.updateUser = (req, res, next) => {
  const { name, about } = req.body;
  User.findByIdAndUpdate(
    req.user._id,
    { name, about },
    { new: true, runValidators: true },
  )
    .orFail(new NotFoundError('Пользователь по указанному _id не найден.'))
    .then((user) => res.send(user))
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
    .then((user) => res.send(user))
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
        .send({'token': token})
        // .cookie('token', token, {
        // maxAge: 3600000 * 24 * 7,
        // httpOnly: true
        // })
        // .end();
    })
    .catch(next);
};
//(err) => res.status(401).send({ message: err.message })