const NotFoundError = require('../utils/NotFoundError');

module.exports.notFoundController = (req, res, next) => {
  next(new NotFoundError('Запрашиваемый ресурс не найден'));
};
