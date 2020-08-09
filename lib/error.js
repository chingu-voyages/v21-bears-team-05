const logger = require("../lib/logger");

class ErrorHandler extends Error {
  constructor(code, message, stack) {
    super();
    this.code = code;
    this.message = message;
    this.stack = stack;
  }
}

ErrorHandler.handleError = function (err, req, res) {
  const { code, message, stack } = err;

  logger.error(
    `${err.status || 500} - ${err.message} - ${req.originalUrl} - ${req.method}`
  );
  res.status(code || 500).send({
    ERROR: {
      statusCode: code || 500,
      message: message || `Internal Server Error`,
      url: req.originalUrl,
      method: req.method,
      stack: stack,
    },
  });
};

module.exports = ErrorHandler;
