const winston = require("winston");

const customLevels = {
  levels: {
    fatal: 0,
    error: 1,
    warn: 2,
    info: 3,
    http: 4,
    debug: 5,
  },
  colors: {
    fatal: "red",
    error: "red",
    warn: "yellow",
    info: "green",
    http: "magenta",
    debug: "blue",
  },
};

const devLogger = winston.createLogger({
  levels: customLevels.levels,
  transports: [
    new winston.transports.Console({
      level: "debug",
      format: winston.format.combine(
        winston.format.colorize({ colors: customLevels.colors }),
        winston.format.cli()
      ),
    }),
  ],
  defaultMeta: { env: "DEV" },
});

const prodLogger = winston.createLogger({
  levels: customLevels.levels,
  transports: [
    new winston.transports.Console({
      level: "info",
      format: winston.format.combine(
        winston.format.colorize({ colors: customLevels.colors }),
        winston.format.cli()
      ),
    }),
    new winston.transports.File({
      level: "error",
      filename: "./errors.log",
      format: winston.format.json(),
    }),
  ],
  defaultMeta: { env: "PROD" },
});

module.exports = {
  devLogger,
  prodLogger,
};
