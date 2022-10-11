const BadRequestError = require('../errors/badRequestError');
const ForbiddenError = require('../errors/forbiddenError');
const NotFoundError = require('../errors/notFoundError');
const Card = require('../models/card');

const linkWithUserModel = [
  { path: 'likes', model: 'user' },
  { path: 'owner', model: 'user' },
];

module.exports.getCards = (_, res, next) => {
  Card.find({})
    .populate(linkWithUserModel)
    .then((cards) => res.send(cards))
    .catch(next);
};

module.exports.deleteCard = (req, res, next) => {
  Card.findById(req.params.cardId)
    .then((card) => {
      if (!card) {
        throw new NotFoundError('Пост с таким id не найден');
      }
      if (card.owner.toString() !== req.user._id) {
        throw new ForbiddenError('Нельзя удалять чужие карточки');
      }
      return card.delete()
        .then(() => res.send({ message: 'Пост удалён' }));
    })
    .catch((err) => {
      if (err.name === 'CastError') {
        next(new BadRequestError('Некорректный формат id карточки'));
      } else {
        next(err);
      }
    });
};

module.exports.createCard = (req, res, next) => {
  const { name, link } = req.body;

  Card.create({ name, link, owner: req.user._id })
    .then((card) => res.status(201).send(card))
    .catch((err) => {
      if (err.name === 'ValidationError') {
        next(new BadRequestError(err.message));
      } else {
        next(err);
      }
    });
};

const handleLikeCard = (req, res, next, options) => {
  const action = options.addLike ? '$addToSet' : '$pull';
  Card.findById(req.params.cardId)
    .then((card) => {
      if (!card) {
        throw new NotFoundError('Пост с таким id не найден');
      }
      return Card.findByIdAndUpdate(
        req.params.cardId,
        { [action]: { likes: req.user._id } },
        { new: true },
      )
        .populate(linkWithUserModel)
        .then((newCard) => res.send(newCard));
    })
    .catch((err) => {
      if (err.name === 'CastError') {
        next(new BadRequestError('Некорректный формат id карточки'));
      } else {
        next(err);
      }
    });
};

module.exports.likeCard = (req, res, next) => {
  handleLikeCard(req, res, next, { addLike: true });
};

module.exports.dislikeCard = (req, res, next) => {
  handleLikeCard(req, res, next, { addLike: false });
};
