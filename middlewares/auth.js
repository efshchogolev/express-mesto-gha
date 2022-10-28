// middlewares/auth.js
const jwt = require('jsonwebtoken');
const {
  // DATA_ERROR_CODE,
  // NOT_FOUND_ERROR_CODE,
  // DEFAULT_ERROR_CODE,
  // MONGO_DB_CODE,
  AUTHORIZATION_ERROR_CODE,
  FORBIDDEN_ERROR_CODE,
} = require('../utils/constants');

// eslint-disable-next-line consistent-return
module.exports.tokenAuth = (req, res, next) => {
  const token = req.cookies.jwt;

  if (!token) {
    return res
      .status(AUTHORIZATION_ERROR_CODE)
      .send({ message: 'Необходима авторизация' });
  }

  let payload;

  try {
    payload = jwt.verify(token, 'some-secret-key');
    if (!payload) return res.status(FORBIDDEN_ERROR_CODE).send({ message: 'Необходимы права доступа' });
  } catch (err) {
    return res
      .status(AUTHORIZATION_ERROR_CODE)
      .send({ message: 'Необходима авторизация' });
  }
  req.user = payload;

  next();
};
