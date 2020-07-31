const { createLogger, format, transports } = require("winston");
const { combine, simple, colorize } = format;
const appRoot = require("app-root-path");

const logger = createLogger({
  level: "debug",
  format: simple(),
  exitOnError: false,
  transports: [
    new transports.File({
      filename: `${appRoot}/log/error.log`,
      level: "error",
    }),
    new transports.File({
      filename: `${appRoot}/log/combined.log`,
      level: "info",
    }),
  ],
  rejectionHandlers: [
    new transports.File({ filename: `${appRoot}/log/rejections.log` }),
  ],
});

logger.stream = {
  write: function (message, encoding) {
    logger.info(message);
  },
};

if (process.env.NODE_ENV !== "production") {
  logger.add(
    new transports.Console({
      format: combine(colorize(), simple()),
      handleExceptions: true,
      level: "debug",
    })
  );
}

module.exports = logger;
