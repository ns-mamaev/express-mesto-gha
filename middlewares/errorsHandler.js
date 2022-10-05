module.exports = (err, _, res, next) => {
  const { statusCode = 500, message, name } = err;
  if (name === 'CastError') {
    res.status(400).send({ message: 'Некорректный id в запросе' });
    return;
  }
  if (name === 'ValidationError') {
    res.status(400).send({ message });
    return;
  }
  res
    .status(statusCode)
    .send({
      message: statusCode === 500 ? 'Ошибка сервера' : message,
    });
  next();
};
