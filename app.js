const express = require('express');
const mongoose = require('mongoose');
const bodyParser = require('body-parser');
const cookieParser = require('cookie-parser');
const { errors } = require('celebrate');
const helmet = require('helmet');
const limiter = require('express-rate-limit');
const cardsRouter = require('./routes/cardsRouter');
const usersRouter = require('./routes/usersRouter');
const auth = require('./middlewares/auth');
const errorsHandler = require('./middlewares/errorsHandler');
const { login, createUser } = require('./controllers/user');
const NotFoundError = require('./errors/notFoundError');
const { validateLoginData, validateRegisterData } = require('./utills/validators/userValidators');

const { PORT = 3000 } = process.env;

const app = express();
mongoose.connect('mongodb://localhost:27017/mestodb');
app.use(bodyParser.json());
app.use(cookieParser());
app.use(helmet());
app.use(limiter({
  windowMs: 10 * 60 * 1000,
  max: 100,
}));

app.post('/signin', validateLoginData, login);
app.post('/signup', validateRegisterData, createUser);
app.use(auth); // ниже защищенные роуты
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
