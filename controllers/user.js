const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const User = require('../models/user');
const NotFoundError = require('../errors/notFoundError');
const UnauthorizedError = require('../errors/unauthorizedError');
const BadRequestError = require('../errors/badRequestError');

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
      const token = jwt.sign({ _id: user._id }, 'secret-key', { expiresIn: '7d' });
      res
        .cookie('token', token, {
          maxAge: 3600 * 24 * 7,
          httpOnly: true,
        })
        .end();
    })
    .catch(next);
};

module.exports.createUser = async (req, res, next) => {
  const { email, password } = req.body;
  try {
    const user = await User.findOne({ email });
    if (user) {
      throw new UnauthorizedError('Пользователь с таким e-mail уже зарегистрирован');
    }
    const hash = await bcrypt.hash(password, 10);
    const newUser = await User.create({ email, password: hash });
    res.status(201).send(newUser);
  } catch (err) {
    next(err);
  }
};

module.exports.updateUser = (req, res) => {
  if (Object.keys(req.body).length === 0) {
    res.status(400).send({ message: 'Передан пустой запрос' }); //  не делаю запрос к БД, если пришло пустое тело в запросе пользователя
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
        res.status(400).send(err);
        return;
      }
      if (err.name === 'CastError') {
        res.status(404).send({ error: 'Пользователь с таким id не найден' });
        return;
      }
      res.status(500).send(err);
    });
};

module.exports.getOwnProfile = (req, res) => {
  User.findOne({ _id: req.user._id })
    .then((user) => res.send(user))
    .catch((err) => res.satatus(401).send({ message: err.message }));
};
