const cardsRouter = require('express').Router();
const {
  getCards,
  deleteCard,
  createCard,
  likeCard,
  dislikeCard,
} = require('../controllers/card');

cardsRouter.get('/cards', getCards);
cardsRouter.delete('/cards/:id', deleteCard);
cardsRouter.post('/cards', createCard);
cardsRouter.put('/cards/:id/likes', likeCard);
cardsRouter.delete('/cards/:id/likes', dislikeCard);

module.exports = cardsRouter;
