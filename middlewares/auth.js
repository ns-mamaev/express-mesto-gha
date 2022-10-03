const jwt = require('jsonwebtoken');
const { UNAUTHORIZED_ERROR_CODE } = require('../utills/constants');

// eslint-disable-next-line consistent-return
module.exports = (req, res, next) => {
  const { authorization } = req.headers;

  if (!authorization || !authorization.startsWith('Bearer ')) {
    return res.status(UNAUTHORIZED_ERROR_CODE).send({ message: 'Необходима авторизация' });
  }

  const token = authorization.replace('Bearer ', '');
  let payload;

  try {
    payload = jwt.verify(token, 'secret-key');
  } catch (err) {
    return res.status(UNAUTHORIZED_ERROR_CODE).send({ message: 'Необходима авторизация' });
  }

  req.user = payload;

  next();
};
