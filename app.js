const express = require('express');
const mongoose = require('mongoose');
const bodyParser = require('body-parser');
const cookieParser = require('cookie-parser');
const { errors } = require('celebrate');
const helmet = require('helmet');
const limiter = require('express-rate-limit');
const errorsHandler = require('./middlewares/errorsHandler');
const router = require('./routes');

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
app.use(router);
app.use(errors());
app.use(errorsHandler);

app.listen(PORT, () => {
  console.log(`App listening at port ${PORT}`);
});
