const express = require('express');
const mongoose = require('mongoose');
const bodyParser = require('body-parser');
const cookieParser = require('cookie-parser');
const { errors } = require('celebrate');
const userRouter = require('./routes/userRoutes');
const cardRouter = require('./routes/cardRoutes');
const { tokenAuth } = require('./middlewares/auth');
const { NOT_FOUND_ERROR_CODE } = require('./utils/constants');
const { login, createUser } = require('./controllers/user');
const { validateLogin, validateRegistration } = require('./utils/validators/userValidator');

const { PORT = 3000, MONGO_URL = 'mongodb://localhost:27017/mestodb' } = process.env;

const app = express();
app.use(bodyParser.json());
app.use(cookieParser());

mongoose.connect(MONGO_URL, { autoIndex: true });

app.post('/signin', validateLogin, login);
app.post('/signup', validateRegistration, createUser);

app.use('/users', tokenAuth, userRouter);
app.use('/cards', tokenAuth, cardRouter);
app.use('*', tokenAuth, (req, res) => {
  res.status(NOT_FOUND_ERROR_CODE).send({
    message: 'Неверный адрес',
  });
});

app.use(errors());

app.use((err, req, res, next) => {
  const { statusCode = 500, message } = err;

  res
    .status(statusCode)
    .send({
      message: statusCode === 500
        ? 'На сервере произошла ошибка'
        : message,
    });
  next();
});
app.listen(PORT, () => {
  // eslint-disable-next-line no-console
  console.log(`App listening on port ${PORT}`);
});
