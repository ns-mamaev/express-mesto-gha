module.exports.INCORRECT_DATA_ERROR_CODE = 400;
module.exports.UNAUTHORIZED_ERROR_CODE = 401;
module.exports.NOT_FOUND_ERROR_CODE = 404;
module.exports.DEFAULT_ERROR_CODE = 500;
module.exports.SUCCESS_CREATED_CODE = 201;
module.exports.URL_REGEXP = /https?:\/\/(www\.)?[-a-zA-Z0-9@:%._+~#=]{1,256}\.[a-zA-Z0-9()]{1,6}\b([-a-zA-Z0-9()@:%_+.~#?&//=]*)/;
const { celebrate, Joi } = require('celebrate');

module.exports.userSchema = {
  body: Joi.object().keys({
    email: Joi.string().required().email(),
    password: Joi.string().required().min(8),
    name: Joi.string().min(2).max(30),
    about: Joi.string().min(2).max(30),
    avatar: Joi.string().uri(),
  }),
};
