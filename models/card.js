const db = require('mongoose');
const validator = require('validator');

const { Schema } = db;

const cardSchema = new Schema({
  name: {
    type: String,
    required: true,
    minlength: [2, 'поле должно содержать минимум 2 символа'],
    maxlength: [30, 'максимальная длина поля 30 символов'],
  },
  link: {
    type: String,
    required: true,
    validate: {
      validator: (v) => validator.isURL(v, { protocols: ['http', 'https'], require_protocol: true }),
      message: ({ value }) => `${value} - некоректный адрес URL. Ожидается адрес в формате: http(s)://(www).site.com`,
    },
  },
  owner: {
    type: Schema.Types.ObjectId,
    ref: 'user',
    required: true,
  },
  likes: [{
    type: Schema.Types.ObjectId,
    ref: 'user',
    default: [],
  }],
  createdAt: {
    type: Date,
    default: Date.now(),
  },
});

module.exports = db.model('card', cardSchema);
