const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const User = require('../models/user');
const {
  DATA_ERROR_CODE,
  NOT_FOUND_ERROR_CODE,
  DEFAULT_ERROR_CODE,
  MONGO_DB_CODE,
  AUTHORIZATION_ERROR_CODE,
} = require('../utils/constants');

module.exports.getUsers = (req, res) => {
  User.find({})
    .then((user) => res.send({ user }))
    .catch(() => res
      .status(DEFAULT_ERROR_CODE)
      .send({ message: 'Не удалось получить данные' }));
};

module.exports.getMe = (req, res) => {
  User.findOne({ _id: req.user._id }).then((user) => res.send({ user }))
    .catch(() => res
      .status(DEFAULT_ERROR_CODE)
      .send({ message: 'Не удалось получить данные' }));
};

module.exports.getUserById = (req, res) => {
  User.findById(req.params.userId)
    .orFail(new Error('Not Found'))

    .then((user) => res.send({ user }))
    .catch((err) => {
      if (err.message === 'Not Found') {
        return res
          .status(NOT_FOUND_ERROR_CODE)
          .send({ message: 'Пользователь не найден' });
      }
      if (err.name === 'CastError') {
        return res
          .status(DATA_ERROR_CODE)
          .send({ message: 'Некорректный ID' });
      }
      if (err.code === MONGO_DB_CODE) {
        return res.status(409).send({ message: 'Такой пользователь уже зарегестрирован' });
      }
      return res
        .status(DEFAULT_ERROR_CODE)
        .send({ message: 'На сервере произошла ошибка' });
    });
};

// eslint-disable-next-line consistent-return
module.exports.createUser = (req, res) => {
  const {
    name, about, avatar, email, password,
  } = req.body;
  if (!email || !password) {
    return res.status(DATA_ERROR_CODE).send({ message: 'Поле пароля или пользователя пустое' });
  }
  bcrypt.hash(password, 10).then((hash) => User.create({
    name, about, avatar, email, password: hash,
  }))
    .then((user) => res.send({ user, message: 'Пользователь создан' }))
    .catch((err) => {
      if (err.name === 'ValidationError') {
        return res
          .status(DATA_ERROR_CODE)
          .send({ message: 'Ошибка валидации', err });
      }
      return res
        .status(DEFAULT_ERROR_CODE)
        .send({ message: 'На сервере произошла ошибка' });
    });
};

// eslint-disable-next-line consistent-return
module.exports.login = (req, res) => {
  const { email, password } = req.body;
  if (!email || !password) {
    return res.status(DATA_ERROR_CODE).send({ message: 'Поле пароля или пользователя пустое' });
  }
  User.findOne({ email }).select('+password').then((user) => bcrypt.compare(password, user.password)
    .then(
      // eslint-disable-next-line consistent-return
      (match) => {
        if (!match) {
          return res.status(AUTHORIZATION_ERROR_CODE).send({ message: 'ошибка авторизации' });
        }
        const token = jwt.sign({ _id: user._id }, 'some-secret-key', { expiresIn: '7d' });
        if (!token) {
          return res.status(DEFAULT_ERROR_CODE).send({ message: 'Ошибка с токеном' });
        }
        // return res.status(200).send({ data: token });
        res.cookie('jwt', token, {
          maxAge: 3600000 * 24 * 7,
          httpOnly: true,
        }).end();
      },
    )).catch((err) => res.status(DEFAULT_ERROR_CODE).send({ message: 'На сервере произошла ошибка', err }));
};

module.exports.updateUserInfo = (req, res) => {
  const { name, about } = req.body;
  User.findByIdAndUpdate(
    req.user._id,
    { name, about },
    { new: true, runValidators: true },
  )
    .then((user) => res.send({ user, message: 'Информация изменена' }))
    .catch((err) => {
      if (err.name === 'ValidationError') {
        return res
          .status(DATA_ERROR_CODE)
          .send({ message: 'Ошибка валидации' });
      }
      return res
        .status(DEFAULT_ERROR_CODE)
        .send({ massage: 'На сервере произошла ошибка' });
    });
};

module.exports.updateUserAvatar = (req, res) => {
  const { avatar } = req.body;
  User.findByIdAndUpdate(
    req.user._id,
    { avatar },
    { new: true, runValidators: true },
  )
    .then((user) => res.send({ user, message: 'Аватар изменен' }))
    .catch((err) => {
      if (err.name === 'ValidationError') {
        return res
          .status(DATA_ERROR_CODE)
          .send({ message: 'Ошибка валидации' });
      }
      return res.status(DEFAULT_ERROR_CODE).send({ massage: 'Произошла ошибка' });
    });
};
