const User = require('../models/user');

module.exports.getUsers = (req, res) => {
  User.find({})
    .then((users) => res.send(users));
};

module.exports.getUser = (req, res) => {
  User.findOne({ _id: req.params.id })
    .then((user) => res.send(user))
    .catch(() => res.send({ error: 'Пользователь с таким id не найден' }));
};

module.exports.createUser = (req, res) => {
  const { name, about, avatar } = req.body;

  User.create({ name, about, avatar })
    .then((user) => res.send(user))
    .catch((err) => res.send(err.message));
};

module.exports.updateUserIfo = (req, res) => {
  const { name, about } = req.body;

  User.findByIdAndUpdate(
    req.user._id,
    { name, about },
    { new: true },
  )
    .then((user) => res.send(user))
    .catch((err) => res.send({ error: err.message }));
};

module.exports.updateUserAvatar = (req, res) => {
  const { avatar } = req.body;

  User.findByIdAndUpdate(
    req.user._id,
    { avatar },
    { new: true },
  )
    .then((user) => res.send(user))
    .catch((err) => res.send({ error: err.message }));
};
