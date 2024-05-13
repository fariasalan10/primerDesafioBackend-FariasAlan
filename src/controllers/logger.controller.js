class LoggerController {
  static async getAll(req, res) {
    req.logger.fatal("this is a fatal error");
    req.logger.error("this is an error");
    req.logger.warn("this is a warning");
    req.logger.info("this is an information");
    req.logger.http("this is an http request");
    req.logger.debug("this is a debug");
    res.send({ status: "success", payload: "loggers test" });
  }
}

module.exports = LoggerController;
