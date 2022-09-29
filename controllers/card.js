const Card = require('../models/card');

module.exports.getCards = (req, res) => {
  Card.find({})
    .populate([{
      path: 'likes',
      model: 'user',
    }])
    .then((cards) => res.send(cards))
    .catch((err) => res.status(500).send(err));
};

module.exports.deleteCard = (req, res) => {
  Card.findById(req.params.cardId)
    .then((card) => {
      if (!card) {
        res.status(404).send({ message: 'Пост с таким id не найден' });
        return;
      }
      Card.findByIdAndRemove(req.params.cardId)
        .then(() => res.send({ message: 'Пост удалён' }))
        .catch((err) => res.status(500).send(err));
    })
    .catch((err) => {
      if (err.name === 'CastError') {
        res.status(400).send(err);
        return;
      }
      res.status(500).send(err);
    });
};

module.exports.createCard = (req, res) => {
  const { name, link } = req.body;

  Card.create({ name, link, owner: req.user._id })
    .then((card) => res.status(201).send(card))
    .catch((err) => {
      if (err.name === 'ValidationError') {
        res.status(400).send(err);
        return;
      }
      res.status(500).send(err);
    });
};

const handleLikeCard = (req, res, options) => {
  const action = options.addLike ? '$addToSet' : '$pull';
  Card.findById(req.params.cardId)
    .then((card) => {
      if (!card) {
        res.status(404).send({ message: 'Пост с таким id не найден' });
        return;
      }
      Card.findByIdAndUpdate(
        req.params.cardId,
        { [action]: { likes: req.user._id } },
        { new: true },
      )
        .then((newCard) => res.send(newCard))
        .catch((err) => res.status(500).send(err));
    })
    .catch((err) => {
      if (err.name === 'CastError') {
        res.status(400).send(err);
        return;
      }
      res.status(500).send(err);
    });
};

module.exports.likeCard = (req, res) => {
  handleLikeCard(req, res, { addLike: true });
};

module.exports.dislikeCard = (req, res) => {
  handleLikeCard(req, res, { addLike: false });
};
