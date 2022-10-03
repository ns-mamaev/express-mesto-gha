const db = require('mongoose');
const { URL_REGEXP } = require('../utills/constants');

const userSchema = new db.Schema({
  name: {
    type: String,
    default: 'Жак-Ив-Кусто',
    minlength: [2, 'поле должно содержать минимум 2 символа'],
    maxlength: [30, 'максимальная длина поля 30 символов'],
  },
  about: {
    type: String,
    default: 'Исследователь',
    minlength: [2, 'поле должно содержать минимум 2 символа'],
    maxlength: [30, 'максимальная длина поля 30 символов'],
  },
  avatar: {
    type: String,
    default: 'https://pictures.s3.yandex.net/resources/jacques-cousteau_1604399756.png',
    validate: {
      validator: (v) => URL_REGEXP.test(v),
      message: ({ value }) => `${value} - некоректный адрес URL`,
    },
  },
  email: {
    type: String,
    required: true,
    unique: true,
  },
  password: {
    type: String,
    required: true,
    minlength: [8, 'минимальная длина пароля - 8 символов'],
  },
});

module.exports = db.model('user', userSchema);
