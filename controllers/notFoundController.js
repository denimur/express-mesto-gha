const { notFound } = require('../utils/status');

module.exports.notFoundController = (req, res) => {
  res.status(notFound).send({ message: 'Запрашиваемый ресурс не найден' });
};
