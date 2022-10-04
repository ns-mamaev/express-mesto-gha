const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const User = require('../models/user');

const {
  NOT_FOUND_ERROR_CODE,
  UNAUTHORIZED_ERROR_CODE,
  INCORRECT_DATA_ERROR_CODE,
  DEFAULT_ERROR_CODE,
  SUCCESS_CREATED_CODE,
} = require('../utills/constants');

module.exports.getUsers = (_, res) => {
  User.find({})
    .then((users) => res.send(users))
    .catch((err) => res.status(DEFAULT_ERROR_CODE).send(err));
};

module.exports.getUser = (req, res) => {
  User.findOne({ _id: req.params.id })
    .then((user) => {
      if (!user) {
        res.status(NOT_FOUND_ERROR_CODE).send({ message: 'Пользователь с таким id не найден' });
        return;
      }
      res.send(user);
    })
    .catch((err) => {
      if (err.name === 'CastError') {
        res.status(INCORRECT_DATA_ERROR_CODE).send(err);
        return;
      }
      res.status(DEFAULT_ERROR_CODE).send(err);
    });
};

module.exports.login = (req, res) => {
  const { email, password } = req.body;

  return User.findUser(email, password)
    .then((user) => {
      const token = jwt.sign({ _id: user._id }, 'secret-key', { expiresIn: '7d' });
      res
        .cookie('token', token, {
          maxAge: 3600 * 24 * 7,
          httpOnly: true,
        })
        .end();
    })
    .catch((err) => res.status(UNAUTHORIZED_ERROR_CODE).send({ message: err.message }));
};

module.exports.createUser = async (req, res) => {
  const { email, password } = req.body;
  try {
    const user = await User.findOne({ email });
    if (user) {
      res.status(UNAUTHORIZED_ERROR_CODE).send({ error: 'Пользователь с таким e-mail уже зарегистрирован' });
      return;
    }
    const hash = await bcrypt.hash(password, 10);
    const newUser = await User.create({ email, password: hash });
    res.status(SUCCESS_CREATED_CODE).send(newUser);
  } catch (err) {
    if (err.name === 'ValidationError') {
      res.status(INCORRECT_DATA_ERROR_CODE).send(err);
      return;
    }
    res.status(DEFAULT_ERROR_CODE).send(err);
  }
};

module.exports.updateUser = (req, res) => {
  if (Object.keys(req.body).length === 0) {
    res.status(INCORRECT_DATA_ERROR_CODE).send({ message: 'Передан пустой запрос' }); //  не делаю запрос к БД, если пришло пустое тело в запросе пользователя
    return;
  }
  User.findByIdAndUpdate(
    req.user._id,
    req.body,
    {
      new: true,
      runValidators: true,
    },
  )
    .then((user) => res.send(user))
    .catch((err) => {
      if (err.name === 'ValidationError') {
        res.status(INCORRECT_DATA_ERROR_CODE).send(err);
        return;
      }
      if (err.name === 'CastError') {
        res.status(NOT_FOUND_ERROR_CODE).send({ error: 'Пользователь с таким id не найден' });
        return;
      }
      res.status(DEFAULT_ERROR_CODE).send(err);
    });
};

module.exports.getOwnProfile = (req, res) => {
  User.findOne({ _id: req.user._id })
    .then((user) => res.send(user))
    .catch((err) => res.satatus(UNAUTHORIZED_ERROR_CODE).send({ message: err.message }));
};
