const jwt = require('jsonwebtoken');
const { UNAUTHORIZED_ERROR_CODE } = require('../utills/constants');

// eslint-disable-next-line consistent-return
module.exports = (req, res, next) => {
  const { token } = req.cookies;

  if (!token) {
    return res.status(UNAUTHORIZED_ERROR_CODE).send({ message: 'Необходима авторизация' });
  }
  let payload;

  try {
    payload = jwt.verify(token, 'secret-key');
  } catch (err) {
    return res.status(UNAUTHORIZED_ERROR_CODE).send({ message: 'Необходима авторизация' });
  }

  req.user = payload;
  console.log(req.user);

  next();
};
