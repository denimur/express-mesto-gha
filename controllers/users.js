const { default: mongoose } = require('mongoose');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const User = require('../models/user');
const { badRequest, notFound, unexpected } = require('../utils/status');

module.exports.createUser = (req, res) => {
  const {
    name, about, avatar, email, password,
  } = req.body;
  bcrypt.hash(password, 10)
    .then((hash) => User.create({
      name, about, avatar, email, password: hash,
    }))
    .then((user) => res.send({ data: user }))
    .catch((err) => {
      if (err instanceof mongoose.Error.ValidationError) {
        return res.status(badRequest).send({
          message: 'Переданы некорректные данные при создании пользователя.',
        });
      }
      return res.status(unexpected).send({ message: err.message });
    });
};

module.exports.getUsers = (req, res) => {
  User.find({})
    .then((data) => res.send({ data }))
    .catch((err) => res.status(unexpected).send({ message: err.message }));
};

module.exports.getUser = (req, res) => {
  User.findById(req.params.userId)
    .orFail(new Error('not found'))
    .then((user) => res.send(user))
    .catch((err) => {
      if (err instanceof mongoose.Error.CastError) {
        return res.status(badRequest).send({
          message: 'Переданы некорректные данные.',
        });
      }
      if (err.message === 'not found') {
        return res
          .status(notFound)
          .send({ message: 'Пользователь по указанному _id не найден.' });
      }
      return res.status(unexpected).send({ message: err.message });
    });
};

module.exports.updateUser = (req, res) => {
  const { name, about } = req.body;
  User.findByIdAndUpdate(
    req.user._id,
    { name, about },
    { new: true, runValidators: true },
  )
    .orFail(new Error('not found'))
    .then((user) => res.send(user))
    .catch((err) => {
      if (err.message === 'not found') {
        return res
          .status(notFound)
          .send({ message: 'Пользователь с указанным _id не найден.' });
      }
      if (err instanceof mongoose.Error.ValidationError) {
        return res.status(badRequest).send({
          message: 'Переданы некорректные данные при обновлении профиля.',
        });
      }
      return res.status(unexpected).send({ message: err.message });
    });
};

module.exports.updateAvatar = (req, res) => {
  const { avatar } = req.body;
  User.findByIdAndUpdate(
    req.user._id,
    { avatar },
    { new: true, runValidators: true },
  )
    .orFail(new Error('not found'))
    .then((user) => res.send(user))
    .catch((err) => {
      if (err.message === 'not found') {
        return res
          .status(notFound)
          .send({ message: 'Пользователь с указанным _id не найден.' });
      }
      if (err instanceof mongoose.Error.ValidationError) {
        return res.status(badRequest).send({
          message: 'Переданы некорректные данные при обновлении аватара.',
        });
      }
      return res.status(unexpected).send({ message: err.message });
    });
};

module.exports.login = (req, res) => {
  const { email, password } = req.body;

  User.findUserByCredentials(email, password)
    .then((user) => {
      const token = jwt.sign({ _id: user._id }, 'mySecretKey', { expiresIn: '7d' });
      res.send({ token });
    })
    .catch((err) => res.status(401).send({ message: err.message }));
};
