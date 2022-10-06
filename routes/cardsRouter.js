const cardsRouter = require('express').Router();
const {
  getCards,
  deleteCard,
  createCard,
  likeCard,
  dislikeCard,
} = require('../controllers/card');
const { validateCardId, validateCardData } = require('../utills/validators/cardValidators');

cardsRouter.get('/', getCards);
cardsRouter.delete('/:cardId', validateCardId, deleteCard);
cardsRouter.post('/', validateCardData, createCard);
cardsRouter.put('/:cardId/likes', validateCardId, likeCard);
cardsRouter.delete('/:cardId/likes', validateCardId, dislikeCard);

module.exports = cardsRouter;
