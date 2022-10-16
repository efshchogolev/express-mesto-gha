const Card = require("../models/card");

module.exports.createCard = (req, res) => {
  const { name, link } = req.body;

  Card.create({ name, link, owner: req.user._id })
    .then(() => res.send({ message: "Карточка добавлена" }))
    .catch((err) => res.status(444).send({ message: "Произошла ошибка" }));
};

module.exports.getCards = (req, res) => {
  Card.find({})
    .then((card) => res.send({ data: card }))
    .catch((err) => res.status(444).send({ message: "Произошла ошибка" }));
};

module.exports.deleteCard = (req, res) => {
  Card.findByIdAndRemove(req.params.cardId)
    .then((card) => res.send({ data: card, message: "Карточка удалена" }))
    .catch((err) => res.status(444).send({ message: "Произошла ошибка" }));
};

module.exports.likeCard = (req, res) =>
  Card.findByIdAndUpdate(
    req.params.cardId,
    { $addToSet: { likes: req.user._id } },
    { new: true }
  )
    .then(() => res.send({ message: "Лайк поставлен" }))
    .catch((err) => res.status(444).send({ message: "Произошла ошибка" }));

module.exports.dislikeCard = (req, res) =>
  Card.findByIdAndUpdate(
    req.params.cardId,
    { $pull: { likes: req.user._id } },
    { new: true }
  )
    .then(() => res.send({ message: "Лайк удален" }))
    .catch((err) => res.status(444).send({ message: "Произошла ошибка" }));
