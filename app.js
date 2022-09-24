const express = require('express');
const mongoose = require('mongoose');
const bodyParser = require('body-parser');
const cardsRouter = require('./routes/cardsRouter');
const usersRouter = require('./routes/usersRouter');

const { PORT = 3000 } = process.env;

const app = express();
app.use(bodyParser.json());
mongoose.connect('mongodb://localhost:27017/mestodb');

app.use((req, res, next) => {
  req.user = {
    _id: '632f2f3f5711a4c311b6273a',
  };

  next();
});
app.use('/', cardsRouter);
app.use('/', usersRouter);

app.listen(PORT, () => {
  console.log(`App listening at port ${PORT}`);
});
