const express = require('express');
const mongoose = require('mongoose');
const bodyParser = require('body-parser');
const cardsRouter = require('./routes/cardsRouter');
const usersRouter = require('./routes/usersRouter');
const { NOT_FOUND_ERROR_CODE } = require('./utills/constants');

const { PORT = 3000 } = process.env;

const app = express();
app.use(bodyParser.json());
mongoose.connect('mongodb://localhost:27017/mestodb');

app.use((req, _, next) => {
  req.user = {
    _id: '632f2f505711a4c311b62740',
  };

  next();
});
app.use('/cards', cardsRouter);
app.use('/users', usersRouter);
app.use('*', (_, res) => {
  res.status(NOT_FOUND_ERROR_CODE).send({ message: 'Ресурс не найден. Проверьте URL и метод запроса' });
});

app.listen(PORT, () => {
  console.log(`App listening at port ${PORT}`);
});
