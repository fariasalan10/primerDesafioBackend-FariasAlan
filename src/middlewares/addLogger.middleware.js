const { devLogger, prodLogger } = require("../utils/loggers.js");

const addLogger = (req, res, next) => {
  // if (process.env.NODE_ENV === "development") {
  //   req.logger = devLogger;
  // } else {
  //   req.logger = prodLogger;
  // }
  // req.logger.info(`NODE_ENV: ${NODE_ENV}`);
  req.logger = devLogger;
  req.logger.http(
    `${req.method} on ${req.url} - ${new Date().toLocaleTimeString()}`
  );
  next();
};

module.exports = addLogger;
