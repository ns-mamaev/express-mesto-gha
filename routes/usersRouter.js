const userRouter = require('express').Router();
const { Joi, celebrate } = require('celebrate');

const {
  getUsers,
  getOwnProfile,
  getUser,
  updateUser,
} = require('../controllers/user');
const { URL_REGEXP } = require('../utills/constants');

const userIdSchema = {
  params: Joi.object().keys({
    id: Joi.string().required().hex().length(24),
  }),
};

const userSchema = {
  body: Joi.object().keys({
    name: Joi.string().min(2).max(30),
    about: Joi.string().min(2).max(30),
    avatar: Joi.string().pattern(URL_REGEXP),
  }),
};

userRouter.get('/', getUsers);
userRouter.get('/me', getOwnProfile);
userRouter.get('/:id', celebrate(userIdSchema), getUser);
userRouter.patch('/me', celebrate(userSchema), updateUser);
userRouter.patch('/me/avatar', celebrate(userSchema), updateUser);

module.exports = userRouter;
