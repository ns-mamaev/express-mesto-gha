const cardsRouter = require('express').Router();
const { getCards } = require('../controllers/card');

cardsRouter.get('/cards', getCards);

module.exports = cardsRouter;
