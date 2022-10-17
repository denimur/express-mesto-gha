const express = require('express');
const mongoose = require('mongoose');
const { notFoundController } = require('./controllers/notFoundController');

const app = express();

app.use(express.json());

mongoose.connect('mongodb://localhost:27017/mestodb', {
  useNewUrlParser: true,
});

app.use((req, res, next) => {
  req.user = {
    _id: '634c79faeca95632c5cdf933',
  };

  next();
});

app.use('/users', require('./routes/users'));
app.use('/cards', require('./routes/cards'));

app.use('/*', notFoundController);

const { PORT = 3000 } = process.env;

app.listen(PORT, () => console.log(`App listening on port ${PORT}`));
