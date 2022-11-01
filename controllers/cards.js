const Card = require('../models/card');
const NotFoundError = require('../utils/NotFoundError');
const ForbiddenError = require('../utils/ForbiddenError');
const { ok } = require('../utils/status');

module.exports.getCards = (req, res, next) => {
  Card.find({})
    .then((cards) => res.status(ok).send({ data: cards }))
    .catch(next);
};

module.exports.createCard = (req, res, next) => {
  const ownerId = req.user._id;
  const { name, link } = req.body;

  Card.create({ name, link, owner: ownerId })
    .then((card) => res.status(ok).send(card))
    .catch(next);
};

module.exports.deleteCard = (req, res, next) => {
  Card.findById(req.params.cardId)
    .orFail(new NotFoundError('Карточка с указанным _id не найдена.'))
    .then((card) => {
      if (req.user._id !== card.owner.toString()) {
        throw new ForbiddenError('Удалять можно только свои карточки.');
      }
      card.remove();
      res.status(ok).send(card);
    })
    .catch(next);
};

module.exports.likeCard = (req, res, next) => Card.findByIdAndUpdate(
  req.params.cardId,
  { $addToSet: { likes: req.user._id } },
  { new: true },
)
  .orFail(new NotFoundError('Передан несуществующий _id карточки.'))
  .then((card) => res.status(ok).send(card))
  .catch(next);

module.exports.dislikeCard = (req, res, next) => Card.findByIdAndUpdate(
  req.params.cardId,
  { $pull: { likes: req.user._id } },
  { new: true },
)
  .orFail(new NotFoundError('Передан несуществующий _id карточки.'))
  .then((card) => res.status(ok).send(card))
  .catch(next);
