const Card = require('../models/card');

const NotFoundError = require('../utils/errors/notFoundError');
const DataError = require('../utils/errors/dataError');

module.exports.createCard = (req, res, next) => {
  const { name, link } = req.body;

  Card.create({ name, link, owner: req.user._id })
    .then((card) => res.send({ card }))
    .catch((err) => {
      if (err.name === 'ValidationError') {
        next(new DataError('Ошибка валидации'));
      } else {
        next(err);
      }
    });
};

module.exports.getCards = (req, res, next) => {
  Card.find({})
    .then((card) => res.send({ card }))
    .catch((err) => next(err));
};

module.exports.deleteCard = (req, res, next) => {
  Card.findByIdAndRemove(req.params.cardId)
    .orFail(new Error('Not Found'))
    .then((card) => res.send({ card, message: 'Карточка удалена' }))
    .catch((err) => {
      if (err.message === 'Not Found') {
        next(new NotFoundError('Карточка не найдена'));
      } else if (err.message === 'CastError') {
        next(new DataError('Неверный ID'));
      } else {
        next(err);
      }
    });
};

module.exports.likeCard = (req, res, next) => Card.findByIdAndUpdate(
  req.params.cardId,
  { $addToSet: { likes: req.user._id } },
  { new: true },
)
  .orFail(new NotFoundError('Карточка не найдена'))
  .then(() => res.send({ message: 'Лайк поставлен' }))
  .catch((err) => {
    if (err.name === 'CastError') {
      next(new DataError('Ошибка валидации'));
    } else {
      next(err);
    }
  });

module.exports.dislikeCard = (req, res, next) => Card.findByIdAndUpdate(
  req.params.cardId,
  { $pull: { likes: req.user._id } },
  { new: true },
)
  .orFail(new NotFoundError('Карточка не найдена'))
  .then(() => res.send({ message: 'Лайк удален' }))
  .catch((err) => {
    if (err.name === 'CastError') {
      next(new DataError('Ошибка валидации'));
    } else {
      next(err);
    }
  });
