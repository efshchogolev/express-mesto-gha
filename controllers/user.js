const User = require("../models/user");

const getUsers = (req, res) => {
  User.find({})
    .then((user) => res.send({ data: user }))
    .catch((err) => res.status(444).send({ message: "Произошла ошибка" }));
};

const getUserById = (req, res) => {
  User.findById(req.params.userId)
    .then((user) => res.send({ data: user }))
    .catch((err) => res.status(444).send({ message: "Произошла ошибка" }));
};

const createUser = (req, res) => {
  const { name, about, avatar } = req.body;

  User.create({ name, about, avatar })
    .then(() => res.send({ message: "Пользователь создан" }))
    .catch((err) => res.status(500).send({ message: "Произошла ошибка" }));
};

module.exports = {
  getUsers,
  getUserById,
  createUser,
};
