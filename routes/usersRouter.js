const userRouter = require('express').Router();
const {
  getUsers,
  getOwnProfile,
  getUser,
  updateUserAvatar,
  updateUserInfo,
} = require('../controllers/user');
const { validateUserId, validateUserInfo, validateUserAvatar } = require('../utills/validators/userValidators');

userRouter.get('/', getUsers);
userRouter.get('/me', getOwnProfile);
userRouter.get('/:id', validateUserId, getUser);
userRouter.patch('/me', validateUserInfo, updateUserInfo);
userRouter.patch('/me/avatar', validateUserAvatar, updateUserAvatar);

module.exports = userRouter;
