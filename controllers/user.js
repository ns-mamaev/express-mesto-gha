const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const User = require('../models/user');
const NotFoundError = require('../errors/notFoundError');
const ConflictError = require('../errors/conflictError');
const BadRequestError = require('../errors/badRequestError');
const { JWT_SECRET } = require('../utills/constants');

module.exports.getUsers = (_, res, next) => {
  User.find({})
    .then((users) => res.send(users))
    .catch(next);
};

module.exports.getUser = (req, res, next) => {
  User.findOne({ _id: req.params.id })
    .then((user) => {
      if (!user) {
        throw new NotFoundError('Пользователь с таким id не найден');
      }
      res.send(user);
    })
    .catch(next);
};

module.exports.login = (req, res, next) => {
  const { email, password } = req.body;

  return User.findUser(email, password)
    .then((user) => {
      const token = jwt.sign({ _id: user._id }, JWT_SECRET, { expiresIn: '7d' });
      res
        .cookie('token', token, {
          maxAge: 3600 * 24 * 7,
          httpOnly: true,
          sameSite: true,
        })
        .send({ email });
    })
    .catch(next);
};

module.exports.createUser = async (req, res, next) => {
  const {
    email,
    password,
    name,
    about,
    avatar,
  } = req.body;
  try {
    const hash = await bcrypt.hash(password, 10);
    const newUser = await User.create({
      name,
      about,
      avatar,
      email,
      password: hash,
    });
    res.status(201).send(newUser);
  } catch (err) {
    if (err.code === 11000) {
      next(new ConflictError('Пользователь с данным email уже существует'));
    } else {
      next(err);
    }
  }
};

module.exports.updateUser = (req, res, next) => {
  if (Object.keys(req.body).length === 0) {
    throw new BadRequestError('Передан пустой запрос'); //  не делаю запрос к БД, если пришло пустое тело в запросе пользователя
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
    .catch(next);
};

module.exports.getOwnProfile = (req, res, next) => {
  User.findOne({ _id: req.user._id })
    .then((user) => res.send(user))
    .catch(next);
};
