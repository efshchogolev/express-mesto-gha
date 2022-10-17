const Card = require("../models/card");
const {
  DATA_ERROR_CODE,
  NOT_FOUND_ERROR_CODE,
  DEFAULT_ERROR_CODE,
} = require("../utils/constants");

module.exports.createCard = (req, res) => {
  const { name, link } = req.body;

  Card.create({ name, link, owner: req.user._id })
    .then(() => res.send({ message: "Карточка добавлена" }))
    .catch((err) => {
      if (err.name === "ValidationError") {
        return res
          .status(DATA_ERROR_CODE)
          .send({ message: "Ошибка валидации", err });
      }
      return res
        .status(DEFAULT_ERROR_CODE)
        .send({ message: "На сервере произошла ошибка", err });
    });
};

module.exports.getCards = (req, res) => {
  Card.find({})
    .then((card) => res.send({ data: card }))
    .catch((err) =>
      res.status(DEFAULT_ERROR_CODE).send({ message: "Произошла ошибка", err })
    );
};

module.exports.deleteCard = (req, res) => {
  Card.findByIdAndRemove(req.params.cardId)
    .orFail(new Error("Not Found"))
    .then((card) => res.send({ data: card, message: "Карточка удалена" }))
    .catch((err) => {
      if (err.message === "Not Found") {
        return res
          .status(NOT_FOUND_ERROR_CODE)
          .send({ message: "Карточка не найдена" });
      }
      return res
        .status(DEFAULT_ERROR_CODE)
        .send({ message: "На сервере произошла ошибка", err });
    });
};

module.exports.likeCard = (req, res) =>
  Card.findByIdAndUpdate(
    req.params.cardId,
    { $addToSet: { likes: req.user._id } },
    { new: true }
  )
    .orFail(new Error("Not Found"))
    .then(() => res.send({ message: "Лайк поставлен" }))
    .catch((err) => {
      if (err.name === "ValidationError") {
        return res
          .status(DATA_ERROR_CODE)
          .send({ message: "Ошибка валидации", err });
      }
      if (err.message === "Not Found") {
        return res
          .status(NOT_FOUND_ERROR_CODE)
          .send({ message: "Карточка не найдена" });
      }
      return res
        .status(DEFAULT_ERROR_CODE)
        .send({ message: "На сервере произошла ошибка", err });
    });

module.exports.dislikeCard = (req, res) =>
  Card.findByIdAndUpdate(
    req.params.cardId,
    { $pull: { likes: req.user._id } },
    { new: true }
  )
    .orFail(new Error("Not Found"))
    .then(() => res.send({ message: "Лайк удален" }))
    .catch((err) => {
      if (err.name === "ValidationError") {
        return res
          .status(DATA_ERROR_CODE)
          .send({ message: "Ошибка валидации", err });
      }
      if (err.message === "Not Found") {
        return res
          .status(NOT_FOUND_ERROR_CODE)
          .send({ message: "Карточка не найдена" });
      }
      return res
        .status(DEFAULT_ERROR_CODE)
        .send({ message: "На сервере произошла ошибка", err });
    });
