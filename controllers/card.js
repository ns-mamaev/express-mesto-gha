const Card = require('../models/card');

module.exports.getCards = (req, res) => {
  Card.find({})
    .then((cards) => res.send(cards));
};

module.exports.deleteCard = (req, res) => {
  Card.deleteOne({ _id: req.params.id })
    .then(() => res.send('Удалил'))
    .catch((err) => res.send(err.message));
};

module.exports.createCard = (req, res) => {
  const { name, link } = req.body;
  const { _id } = req.user;

  Card.create({ name, link, owner: _id })
    .then(() => res.send('Создал карточку'))
    .catch((err) => res.send(err.message));
};

module.exports.likeCard = (req, res) => {

};

module.exports.dislikeCard = (req, res) => {

};
