const { celebrate, Joi } = require('celebrate');
const { URL_REG_EXP } = require('../constants');

module.exports.validateCard = celebrate({
  body: Joi.objext().keys({
    name: Joi.string().required().min(2).max(30),
    link: Joi.string().required().pattern(URL_REG_EXP),
  }),
});
