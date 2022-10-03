const userRouter = require('express').Router();
const {
  getUsers,
  getOwnProfile,
  getUser,
  updateUser,
} = require('../controllers/user');

userRouter.get('/', getUsers);
userRouter.get('/me', getOwnProfile);
userRouter.get('/:id', getUser);
userRouter.patch('/me', updateUser);
userRouter.patch('/me/avatar', updateUser);

module.exports = userRouter;
