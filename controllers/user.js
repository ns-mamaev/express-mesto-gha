const User = require('../models/user');

module.exports.getUsers = (_, res) => {
  User.find({})
    .then((users) => res.send(users))
    .catch((err) => res.status(500).send(err));
};

module.exports.getUser = (req, res) => {
  User.findOne({ _id: req.params.id })
    .then((user) => {
      if (!user) {
        res.status(404).send({ error: 'Пользователь с таким id не найден' });
        return;
      }
      res.send(user);
    })
    .catch((err) => {
      if (err.name === 'CastError') {
        res.status(400).send(err);
        return;
      }
      res.status(500).send(err);
    });
};

module.exports.createUser = (req, res) => {
  const { name, about, avatar } = req.body;

  User.create({ name, about, avatar })
    .then((user) => res.status(201).send(user))
    .catch((err) => {
      if (err.name === 'ValidationError') {
        res.status(400).send(err);
        return;
      }
      res.status(500).send(err);
    });
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
