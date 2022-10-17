const User = require("../models/user");

module.exports.getUsers = (req, res) => {
  User.find({})
    .then((user) => res.send({ data: user }))
    .catch((err) => {
      return res
        .status(500)
        .send({ message: "Не удалось получить данные", err });
    });
};

module.exports.getUserById = (req, res) => {
  User.findById(req.params.userId)
    .orFail(new Error("Not Found"))

    .then((user) => res.send({ data: user }))
    .catch((err) => {
      if (err.message === "Not Found") {
        return res.status(404).send({ message: "Пользователь не найден" });
      }
      if (err.name === "CastError") {
        return res.status(400).send({ message: "Некорректный ID", err });
      }
      return res
        .status(500)
        .send({ message: "На сервере произошла ошибка", err });
    });
};

module.exports.createUser = (req, res) => {
  const { name, about, avatar } = req.body;

  User.create({ name, about, avatar })
    .then(() => res.send({ message: "Пользователь создан" }))
    .catch((err) => {
      if (err.name === "ValidationError") {
        return res.status(400).send({ message: "Ошибка валидации", err });
      }
      return res
        .status(500)
        .send({ message: "На сервере произошла ошибка", err });
    });
};

module.exports.updateUserInfo = (req, res) => {
  const { name, about } = req.body;
  User.findByIdAndUpdate(req.user._id, { name, about }, { new: true })
    .then((user) => res.send({ data: user, message: "Информация изменена" }))
    .catch((err) => {
      if (err.name === "ValidationError") {
        return res.status(400).send({ message: "Ошибка валидации", err });
      }
      return res
        .status(500)
        .send({ massage: "На сервере произошла ошибка", err });
    });
};

module.exports.updateUserAvatar = (req, res) => {
  const { avatar } = req.body;
  User.findByIdAndUpdate(req.user._id, { avatar }, { new: true })
    .then((user) => res.send({ data: user, message: "Аватар изменен" }))
    .catch((err) => {
      if (err.name === "ValidationError") {
        return res.status(400).send({ message: "Ошибка валидации", err });
      }
      return res.status(444).send({ massage: "Произошла ошибка", err });
    });
};
