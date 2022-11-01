const jwt = require('jsonwebtoken');
const UnauthorizedError = require('../utils/UnauthorizedError');

module.exports = (req, res, next) => {
  const { authorization } = req.headers;
  if (!authorization || !authorization.startsWith('Bearer ')) {
    throw new UnauthorizedError('Необходима авторизация.');
  }
  const token = authorization.replace('Bearer ', '');

  let payload;
  try {
    payload = jwt.verify(token, 'mySecretKey');
  } catch (err) {
    throw new UnauthorizedError('Необходима авторизация.');
  }

  req.user = payload;

  next();
};
