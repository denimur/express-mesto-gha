const jwt = require('jsonwebtoken');
const UnauthorizedError = require('../utils/UnauthorizedError');

module.exports = (req, res, next) => {
  const token = req.headers.authorization;
  if (!token) {
    throw new UnauthorizedError('Необходима авторизация.');
  }

  let payload;
  try {
    payload = jwt.verify(token, 'mySecretKey');
  } catch (err) {
    throw new UnauthorizedError('Необходима авторизация.');
  }

  req.user = payload;

  next();
};
