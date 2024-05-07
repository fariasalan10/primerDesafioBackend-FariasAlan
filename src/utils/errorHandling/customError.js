const ErrorTypes = require("./errorTypes");

class CustomError extends Error {
  constructor({ name = "error", cause, message, code = ErrorTypes.UNKNOW }) {
    super(message);
    this.name = name;
    this.cause = cause;
    this.code = code;
  }
}

module.exports = CustomError;
