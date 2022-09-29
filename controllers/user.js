const User = require('../models/user');

module.exports.getUsers = (_, res) => {
  User.find({})
    .then((users) => res.send(users));
};

module.exports.getUser = (req, res) => {
  User.findOne({ _id: req.params.id })
    .then((user) => res.send(user))
    .catch((err) => {
      if (err.name === 'CastError') {
        res.status(404).send({ error: 'Пользователь с таким id не найден' });
        return;
      }
      res.status(500).send(err);
    });
};

module.exports.createUser = (req, res) => {
  const { name, about, avatar } = req.body;

  User.create({ name, about, avatar })
    .then((user) => res.send(user))
    .catch((err) => {
      if (err.name === 'ValidationError') {
        res.status(400).send(err);
        return;
      }
      res.status(500).send(err);
    });
};

module.exports.updateUserIfo = (req, res) => {
  const { name, about } = req.body;

  User.findByIdAndUpdate(
    req.user._id,
    { name, about },
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
      }
      res.status(500).send(err);
    });
};

module.exports.updateUserAvatar = (req, res) => {
  const { avatar } = req.body;

  User.findByIdAndUpdate(
    req.user._id,
    { avatar },
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
      }
      res.status(500).send(err);
    });
};
