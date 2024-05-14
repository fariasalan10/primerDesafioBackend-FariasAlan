const ErrorTypes = require("../utils/errorHandling/errorTypes");

const errorHandler = (err, req, res, next) => {
  console.log(err.cause);
  switch (err.code) {
    case ErrorTypes.UNKNOW:
      res.status(500).send({ status: "error", error: err.name });
      break;
    case ErrorTypes.ROUTING_ERROR:
      res.status(404).send({ status: "error", error: err.name });
      break;
    case ErrorTypes.INVALID_TYPE:
      res.status(400).send({ status: "error", error: err.name });
      break;
    case ErrorTypes.DATABASE_ERROR:
      res.status(500).send({ status: "error", error: err.name });
      break;
    case ErrorTypes.INVALID_PARAMETERS:
      res.status(400).send({ status: "error", error: err.name });
      break;
    case ErrorTypes.NOT_FOUND:
      res.status(404).send({ status: "error", error: err.name });
      break;
    default:
      res.status(500).send({ status: "error", error: "Unhandled error" });
      break;
  }
};

module.exports = errorHandler;
