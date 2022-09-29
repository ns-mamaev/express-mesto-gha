const userRouter = require('express').Router();
const {
  getUsers,
  getUser,
  createUser,
  updateUser,
} = require('../controllers/user');

userRouter.get('/users', getUsers);
userRouter.get('/users/:id', getUser);
userRouter.post('/users', createUser);
userRouter.patch('/users/me', updateUser);
userRouter.patch('/users/me/avatar', updateUser);

module.exports = userRouter;
