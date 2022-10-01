const userRouter = require('express').Router();
const {
  getUsers,
  getUser,
  createUser,
  updateUser,
} = require('../controllers/user');

userRouter.get('/', getUsers);
userRouter.get('/:id', getUser);
userRouter.post('/', createUser);
userRouter.patch('/me', updateUser);
userRouter.patch('/me/avatar', updateUser);

module.exports = userRouter;
