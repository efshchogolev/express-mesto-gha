const User = require("../models/user");

module.exports.getUsers = (req, res) => {
  User.find({})
    .then((user) => res.send({ data: user }))
    .catch((err) => res.status(444).send({ message: "Произошла ошибка" }));
};

module.exports.getUserById = (req, res) => {
  User.findById(req.params.userId)
    .then((user) => res.send({ data: user }))
    .catch((err) => res.status(444).send({ message: "Произошла ошибка" }));
};

module.exports.createUser = (req, res) => {
  const { name, about, avatar } = req.body;

  User.create({ name, about, avatar })
    .then(() => res.send({ message: "Пользователь создан" }))
    .catch((err) => res.status(444).send({ message: "Произошла ошибка" }));
};
