const cookieParser = require('cookie-parser');
const express = require('express');
const mongoose = require('mongoose');
const { Joi, celebrate, errors } = require('celebrate');
const { notFoundController } = require('./controllers/notFoundController');
const { login, createUser } = require('./controllers/users');
const auth = require('./middlewares/auth');

const app = express();

app.use(express.json());
app.use(cookieParser());

mongoose.connect('mongodb://localhost:27017/mestodb', {
  useNewUrlParser: true,
});

function celebrateCreateUser() {
  return celebrate({
    body: Joi.object().keys({
      email: Joi.string().required().email(),
      password: Joi.string().required().min(5),
      name: Joi.string().min(2).max(30),
      about: Joi.string().min(2).max(30),
      avatar: Joi.string(),
    }),
  });
}

function celebrateLogin() {
  return celebrate({
    body: Joi.object().keys({
      email: Joi.string().required().email(),
      password: Joi.string().required().min(5),
    }),
  });
}

app.post('/signup', celebrateCreateUser(), createUser);
app.post('/signin', celebrateLogin(), login);

app.use(auth);

app.use('/users', require('./routes/users'));
app.use('/cards', require('./routes/cards'));

app.use('/*', notFoundController);

const errorHandler = (err, req, res, next) => {
  if (err.code === 11000) {
    return res.status(409).send({ message: 'Пользователь с такими данными уже создан.' });
  }
  if (err instanceof mongoose.Error.CastError) {
    return res.status(400).send({ message: 'Переданы некорректные данные.' });
  }
  if (err instanceof mongoose.Error.ValidationError) {
    return res.status(400).send({ message: 'Переданы некорректные данные.' });
  }

  const { statusCode = 500, message } = err;

  res.status(statusCode).send({ message: statusCode === 500 ? 'На сервере произошла ошибка' : message });
};
app.use(errors());
app.use(errorHandler);

const { PORT = 3000 } = process.env;

app.listen(PORT, () => console.log(`App listening on port ${PORT}`));
