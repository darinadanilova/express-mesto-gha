const errorHandler = (err, req, res, next) => {
  const statusCode = err.statusCode || 500;

  const message = statusCode === 500 ? 'На сервере произошла ошибка' : err.message;
  res.status(statusCode).send({ message });
  next();
};

module.exports = errorHandler;

// class UserNotFound extends Error {
//  constructor(err) {
//    super(err);
//    this.message = 'Пользователь не найден';
//    this.statusCode = 404;
//  }
// }
//
// class AbstractError extends Error {
//  constructor(err) {
//    super(err);
//    this.message = err.body;
//    this.statusCode = err.statusCode;
//  }
// }
//
// const errorHandler = (err, req, res, next) => {
//  let error;
//
//  if (err.statusCode === 404) {
//    error = new UserNotFound(err);
//  } else {
//    error = new AbstractError(err);
//  }
//
//  res.status(err.statusCode).send({ message: error.message });
//  next();
// };

// module.exports = internalServerError;
