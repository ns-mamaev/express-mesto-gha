const userRouter = require('express').Router();
const {
  getUsers,
  getUser,
  createUser,
  updateUserIfo,
  updateUserAvatar,
} = require('../controllers/user');

userRouter.get('/users', getUsers);
userRouter.get('/users/:id', getUser);
userRouter.post('/users', createUser);
userRouter.patch('/users/me', updateUserIfo);
userRouter.patch('/users/me/avatar', updateUserAvatar);

module.exports = userRouter;
