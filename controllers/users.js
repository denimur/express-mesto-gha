const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const User = require('../models/user');
const NotFoundError = require('../utils/NotFoundError');
const UnauthorizedError = require('../utils/UnauthorizedError');
const ForbiddenError = require('../utils/ForbiddenError');
const ConflictError = require('../utils/ConflictError');
const { ok } = require('../utils/status');

module.exports.createUser = (req, res, next) => {
  const {
    name, about, avatar, email, password,
  } = req.body;

  bcrypt.hash(password, 10)
    .then((hash) => User.create({
      name, about, avatar, email, password: hash,
    }))
    .then((user) => {
      res.status(ok).send({
        name: user.name, about: user.about, avatar: user.avatar, email: user.email, _id: user._id,
      });
    })
    .catch((err) => {
      if (err.code === 11000) {
        next(new ConflictError('Пользователь с такими данными уже существует.'));
      }
      // next(err);
    });
};

module.exports.getUsers = (req, res, next) => {
  User.find({})
    .then((data) => res.status(ok).send({ data }))
    .catch(next);
};

// module.exports.addUser = (req, res, next) => {
//   const {
//     name, about, avatar, email, password,
//   } = req.body;
//   // console.log({ name, about, avatar })
//   User.create({
//     name, about, avatar, email, password,
//   })
//     .then((user) => res.status(ok).send(user))
//     .catch(next);
// };

module.exports.getUser = (req, res, next) => {
  User.findById(req.params.userId)
    .orFail(new NotFoundError('Пользователь по указанному _id не найден.'))
    .then((user) => {
      res.status(ok).send(user);
    })
    .catch(next);
};

module.exports.getCurrentUser = (req, res, next) => {
  User.findById(req.user._id)
    .orFail(new NotFoundError('Пользователь по указанному _id не найден.'))
    .then((user) => res.status(ok).send(user))
    .catch(next);
};

module.exports.updateUser = (req, res, next) => {
  const { name, about } = req.body;
  User.findByIdAndUpdate(
    req.user._id,
    { name, about },
    {
      new: true,
      runValidators: true,
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
        throw new ForbiddenError('Можно редактировать только свой аватар.');
      }
      res.status(ok).send(user);
    })
    .catch(next);
};

module.exports.login = (req, res, next) => {
  const { email, password } = req.body;

  User.findUserByCredentials(email, password)
    .then((user) => {
      const token = jwt.sign({ _id: user._id }, 'mySecretKey', { expiresIn: '7d' });
      if (!token) {
        throw new UnauthorizedError('Передан недействительный токен.');
      }
      res
        .status(ok)
        .send({ token });
      // .cookie('token', token, {
      // maxAge: 3600000 * 24 * 7,
      // httpOnly: true
      // })
      // .end();
    })
    .catch(next);
};
