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
      avatar: Joi.string().pattern(/^(https?:\/\/)?([\w-]{1,32}\.[\w-]{1,32})[^\s@]*#?$/),
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
  const { statusCode = 500, message = 'На сервере произошла ошибка' } = err;

  res.status(statusCode).send({ message });

  next();
};

app.use(errors());
app.use(errorHandler);

const { PORT = 3000 } = process.env;

app.listen(PORT, () => console.log(`App listening on port ${PORT}`));
