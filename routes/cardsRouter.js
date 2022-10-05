const cardsRouter = require('express').Router();
const { Joi, celebrate } = require('celebrate');

const {
  getCards,
  deleteCard,
  createCard,
  likeCard,
  dislikeCard,
} = require('../controllers/card');
const { URL_REGEXP } = require('../utills/constants');

const cardIdSchema = {
  params: Joi.object().keys({
    cardId: Joi.string().required().hex().length(24),
  }),
};

const cardSchema = {
  body: Joi.object().keys({
    name: Joi.string().required().min(2).max(30),
    link: Joi.string().required().pattern(URL_REGEXP),
  }),
};

cardsRouter.get('/', getCards);
cardsRouter.delete('/:cardId', celebrate(cardIdSchema), deleteCard);
cardsRouter.post('/', celebrate(cardSchema), createCard);
cardsRouter.put('/:cardId/likes', celebrate(cardIdSchema), likeCard);
cardsRouter.delete('/:cardId/likes', celebrate(cardIdSchema), dislikeCard);

module.exports = cardsRouter;
