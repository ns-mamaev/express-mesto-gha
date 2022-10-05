const express = require('express');
const mongoose = require('mongoose');
const bodyParser = require('body-parser');
const cookieParser = require('cookie-parser');
const { Joi, celebrate, errors } = require('celebrate');
const cardsRouter = require('./routes/cardsRouter');
const usersRouter = require('./routes/usersRouter');
const auth = require('./middlewares/auth');
const errorsHandler = require('./middlewares/errorsHandler');
const { login, createUser } = require('./controllers/user');
const NotFoundError = require('./errors/notFoundError');
const { URL_REGEXP } = require('./utills/constants');

const { PORT = 3000 } = process.env;

const app = express();
app.use(bodyParser.json());
app.use(cookieParser());
mongoose.connect('mongodb://localhost:27017/mestodb');

app.post('/signin', celebrate({
  body: Joi.object().keys({
    email: Joi.string().required().email(),
    password: Joi.string().required().min(8),
  }),
}), login);
app.post('/signup', celebrate({
  body: Joi.object().keys({
    email: Joi.string().required().email(),
    password: Joi.string().required().min(8),
    name: Joi.string().min(2).max(30),
    about: Joi.string().min(2).max(30),
    avatar: Joi.string().pattern(URL_REGEXP),
  }),
}), createUser);
app.use(auth);
app.use('/cards', cardsRouter);
app.use('/users', usersRouter);
app.use('*', () => {
  throw new NotFoundError('Ресурс не найден. Проверьте URL и метод запроса');
});
app.use(errors());
app.use(errorsHandler);

app.listen(PORT, () => {
  console.log(`App listening at port ${PORT}`);
});
