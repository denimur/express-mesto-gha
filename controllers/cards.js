const { default: mongoose } = require('mongoose');
const Card = require('../models/card');
const { badRequest, notFound, unexpected } = require('../utils/status');

module.exports.getCards = (req, res) => {
  Card.find({})
    .populate('owner')
    .then((cards) => res.send({ data: cards }))
    .catch((err) => res.status(unexpected).send({ message: err.message }));
};

module.exports.createCard = (req, res) => {
  const ownwerId = req.user._id;
  const { name, link } = req.body;

  Card.create({ name, link, owner: ownwerId })
    .then((card) => res.send(card))
    .catch((err) => {
      if (err instanceof mongoose.Error.ValidationError) {
        return res.status(badRequest).send({
          message: 'Переданы некорректные данные при создании карточки.',
        });
      }
      return res.status(unexpected).send({ message: err.message });
    });
};

module.exports.deleteCard = (req, res) => {
  Card.findByIdAndDelete(req.params.cardId)
    .orFail(new Error('not found'))
    .then((card) => res.send(card))
    .catch((err) => {
      if (err instanceof mongoose.Error.CastError) {
        return res.status(badRequest).send({
          message: 'Переданы некорректные данные.',
        });
      }
      if (err.message === 'not found') {
        return res
          .status(notFound)
          .send({ message: 'Карточка с указанным _id не найдена.' });
      }
      return res.status(unexpected).send({ message: err.message });
    });
};

module.exports.likeCard = (req, res) => Card.findByIdAndUpdate(
  req.params.cardId,
  { $addToSet: { likes: req.user._id } },
  { new: true },
)
  .orFail(new Error('not found'))
  .populate('owner')
  .then((card) => res.send(card))
  .catch((err) => {
    if (err instanceof mongoose.Error.CastError) {
      return res.status(badRequest).send({
        message: 'Переданы некорректные данные для постановки лайка.',
      });
    }
    if (err.message === 'not found') {
      return res
        .status(notFound)
        .send({ message: 'Передан несуществующий _id карточки.' });
    }
    return res.status(unexpected).send({ message: err.message });
  });

module.exports.dislikeCard = (req, res) => Card.findByIdAndUpdate(
  req.params.cardId,
  { $pull: { likes: req.user._id } },
  { new: true },
)
  .orFail(new Error('not found'))
  .then((card) => res.send(card))
  .catch((err) => {
    if (err instanceof mongoose.Error.CastError) {
      return res
        .status(badRequest)
        .send({ message: 'Переданы некорректные данные при снятии лайка.' });
    }
    if (err.message === 'not found') {
      return res
        .status(notFound)
        .send({ message: 'Передан несуществующий _id карточки.' });
    }
    return res.status(unexpected).send({ message: err.message });
  });