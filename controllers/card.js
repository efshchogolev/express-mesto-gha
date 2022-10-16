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
