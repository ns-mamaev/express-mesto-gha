const db = require('mongoose');
const { URL_REGEXP } = require('../utills/constants');

const userSchema = new db.Schema({
  name: {
    type: String,
    required: true,
    minlength: [2, 'поле должно содержать минимум 2 символа'],
    maxlength: [30, 'максимальная длина поля 30 символов'],
  },
  about: {
    type: String,
    required: true,
    minlength: [2, 'поле должно содержать минимум 2 символа'],
    maxlength: [30, 'максимальная длина поля 30 символов'],
  },
  avatar: {
    type: String,
    required: true,
    validate: {
      validator: (v) => URL_REGEXP.test(v),
      message: ({ value }) => `${value} - некоректный адрес URL`,
    },
  },
});

module.exports = db.model('user', userSchema);
