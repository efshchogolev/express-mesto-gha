const mongoose = require('mongoose');
const validator = require('validator');

const userSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      minlength: 2,
      maxlength: 30,
      required: false,
      default: 'Жак-Ив Кусто',
    },
    about: {
      type: String,
      minlength: 2,
      maxlength: 30,
      required: false,
      default: 'Исследователь',
    },
    avatar: {
      type: String,
      required: false,
      default: 'https://pictures.s3.yandex.net/resources/jacques-cousteau_1604399756.png',
    },
    email: {
      type: String,
      required: true,
      unique: true,
      validate: (value) => {
        if (validator.isEmail(value)) {
          return true;
        }
        return false;
      },
    },
    password: {
      type: String,
      required: true,
    },
  },
  {
    versionKey: false,
  },
);

module.exports = mongoose.model('user', userSchema);
