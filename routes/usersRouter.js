const userRouter = require('express').Router();
const {
  getUsers,
  getUser,
  createUser,
  updateUser,
  login,
} = require('../controllers/user');

userRouter.get('/', getUsers);
userRouter.get('/:id', getUser);
userRouter.patch('/me', updateUser);
userRouter.patch('/me/avatar', updateUser);
userRouter.post('/signin', login);
userRouter.post('/signup', createUser);

module.exports = userRouter;
