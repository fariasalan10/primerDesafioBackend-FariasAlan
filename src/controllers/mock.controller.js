const generateProducts = require("../utils/generateProducts");

class MockController {
  static async generateProducts(req, res) {
    try {
      let mockProducts = [];

      for (let i = 0; i < 10; i++) {
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
