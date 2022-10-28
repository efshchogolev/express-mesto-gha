const express = require('express');
const mongoose = require('mongoose');
const bodyParser = require('body-parser');
const cookieParser = require('cookie-parser');
const userRouter = require('./routes/userRoutes');
const cardRouter = require('./routes/cardRoutes');
const { tokenAuth } = require('./middlewares/auth');
const { NOT_FOUND_ERROR_CODE } = require('./utils/constants');
const { login, createUser } = require('./controllers/user');

const { PORT = 3000, MONGO_URL = 'mongodb://localhost:27017/mestodb' } = process.env;

const app = express();
app.use(bodyParser.json());
app.use(cookieParser());

mongoose.connect(MONGO_URL, { autoIndex: true });

app.post('/signin', login);
app.post('/signup', createUser);

app.use('/users', tokenAuth, userRouter);
app.use('/cards', tokenAuth, cardRouter);
app.use('*', (req, res) => {
  res.status(NOT_FOUND_ERROR_CODE).send({
    message: 'Неверный адрес',
  });
});
app.listen(PORT, () => {
  // eslint-disable-next-line no-console
  console.log(`App listening on port ${PORT}`);
});
