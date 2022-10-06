const router = require('express').Router();
const { login, createUser, logout } = require('../controllers/user');
const { validateLoginData, validateRegisterData } = require('../utills/validators/userValidators');
const cardsRouter = require('./cardsRouter');
const usersRouter = require('./usersRouter');
const auth = require('../middlewares/auth');
const NotFoundError = require('../errors/notFoundError');

router.post('/signin', validateLoginData, login);
router.post('/signup', validateRegisterData, createUser);

router.use(auth); // ниже защищенные роуты

router.use('/cards', cardsRouter);
router.use('/users', usersRouter);
router.get('/signout', logout);
router.use(() => {
  throw new NotFoundError('Ресурс не найден. Проверьте URL и метод запроса');
});

module.exports = router;
