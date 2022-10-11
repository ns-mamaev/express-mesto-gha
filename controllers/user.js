const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const User = require('../models/user');
const NotFoundError = require('../errors/notFoundError');
const ConflictError = require('../errors/conflictError');
const BadRequestError = require('../errors/badRequestError');
const { getJWTSecretKey } = require('../utills/utills');

module.exports.getUsers = (_, res, next) => {
  User.find({}).select('+email')
    .then((users) => res.send(users))
    .catch(next);
};

module.exports.getUser = (req, res, next) => {
  User.findOne({ _id: req.params.id }).select('+email')
    .then((user) => {
      if (!user) {
        throw new NotFoundError('Пользователь с таким id не найден');
      }
      res.send(user);
    })
    .catch((err) => {
      if (err.name === 'CastError') {
        next(new BadRequestError('Некорректный формат id пользователя'));
      } else {
        next(err);
      }
    });
};

const createTokenById = (id) => {
  const secretKey = getJWTSecretKey();
  return jwt.sign({ _id: id }, secretKey, { expiresIn: '7d' });
};

const sendCookie = (res, { _id: id, email }) => {
  const token = createTokenById(id);
  return res
    .cookie('token', token, {
      maxAge: 604800000,
      httpOnly: true,
      sameSite: true,
    })
    .send({ email });
};

module.exports.login = (req, res, next) => {
  const { email, password } = req.body;
  return User.findUserByCredentials(email, password)
    .then((user) => {
      sendCookie(res, user);
    })
    .catch((err) => {
      if (err.name === 'ValidationError') {
        next(new BadRequestError(err.message));
      } else {
        next(err);
      }
    });
};

module.exports.logout = (_, res) => {
  res.clearCookie('token').send({ message: 'Вы вышли из профиля' });
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
    res.status(201);
    sendCookie(res, newUser); // устанавливаю куки и при регистрации, чтобы не вводить логин
  } catch (err) {
    if (err.code === 11000) {
      next(new ConflictError('Пользователь с данным email уже существует'));
    } else if (err.name === 'ValidationError') {
      next(new BadRequestError(err.message));
    } else {
      next(err);
    }
  }
};

const updateUser = (req, res, next, userData) => {
  User.findByIdAndUpdate(
    req.user._id,
    userData,
    {
      new: true,
      runValidators: true,
    },
  )
    .then((user) => res.send(user))
    .catch((err) => {
      if (err.name === 'ValidationError') {
        next(new BadRequestError(err.message));
      } else {
        next(err);
      }
    });
};

module.exports.updateUserInfo = (req, res, next) => {
  const userData = {
    name: req.body.name,
    about: req.body.about,
  };
  updateUser(req, res, next, userData);
};

module.exports.updateUserAvatar = (req, res, next) => {
  updateUser(req, res, next, { avatar: req.body.avatar });
};

module.exports.getOwnProfile = (req, res, next) => {
  User.findOne({ _id: req.user._id }).select('+email')
    .then((user) => res.send(user))
    .catch(next);
};
