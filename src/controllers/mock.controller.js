const generateProducts = require("../utils/faker");

class MockController {
  static async getUsers(req, res) {
    try {
      let mockProducts = [];

      for (let i = 0; i < 100; i++) {
        mockProducts.push(generateProducts());
      }

      res.send({ status: "success", payload: mockProducts });
    } catch (error) {
      res
        .status(error.status || 500)
        .send({ status: "error", error: error.message });
    }
  }
}

module.exports = MockController;
