const Card = require('../models/card');
const {
  NOT_FOUND_ERROR_CODE,
  INCORRECT_DATA_ERROR_CODE,
  DEFAULT_ERROR_CODE,
  SUCCESS_CREATED_CODE,
} = require('../utills/constants');

const LINK_WITH_USERS = [{ path: 'likes', model: 'user' }];

module.exports.getCards = (_, res) => {
  Card.find({})
    .populate(LINK_WITH_USERS)
    .then((cards) => res.send(cards))
    .catch((err) => res.status(DEFAULT_ERROR_CODE).send(err));
};

module.exports.deleteCard = (req, res) => {
  Card.findById(req.params.cardId)
    .then((card) => {
      if (!card) {
        res.status(NOT_FOUND_ERROR_CODE).send({ message: 'Пост с таким id не найден' });
        return;
      }
      if (card.owner.toString() !== req.user._id) {
        res.status(403).send({ message: 'Нельзя удалять чужие карточки' });
        return;
      }
      Card.findByIdAndRemove(req.params.cardId)
        .then(() => res.send({ message: 'Пост удалён' }))
        .catch((err) => res.status(DEFAULT_ERROR_CODE).send(err));
    })
    .catch((err) => {
      if (err.name === 'CastError') {
        res.status(INCORRECT_DATA_ERROR_CODE).send(err);
        return;
      }
      res.status(DEFAULT_ERROR_CODE).send(err);
    });
};

module.exports.createCard = (req, res) => {
  const { name, link } = req.body;

  Card.create({ name, link, owner: req.user._id })
    .then((card) => res.status(SUCCESS_CREATED_CODE).send(card))
    .catch((err) => {
      if (err.name === 'ValidationError') {
        res.status(INCORRECT_DATA_ERROR_CODE).send(err);
        return;
      }
      res.status(DEFAULT_ERROR_CODE).send(err);
    });
};

const handleLikeCard = (req, res, options) => {
  const action = options.addLike ? '$addToSet' : '$pull';
  Card.findById(req.params.cardId)
    .then((card) => {
      if (!card) {
        res.status(NOT_FOUND_ERROR_CODE).send({ message: 'Пост с таким id не найден' });
        return;
      }
      Card.findByIdAndUpdate(
        req.params.cardId,
        { [action]: { likes: req.user._id } },
        { new: true },
      )
        .populate(LINK_WITH_USERS)
        .then((newCard) => res.send(newCard))
        .catch((err) => res.status(DEFAULT_ERROR_CODE).send(err));
    })
    .catch((err) => {
      if (err.name === 'CastError') {
        res.status(INCORRECT_DATA_ERROR_CODE).send(err);
        return;
      }
      res.status(DEFAULT_ERROR_CODE).send(err);
    });
};

module.exports.likeCard = (req, res) => {
  handleLikeCard(req, res, { addLike: true });
};

module.exports.dislikeCard = (req, res) => {
  handleLikeCard(req, res, { addLike: false });
};
