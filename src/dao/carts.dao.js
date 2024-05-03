const cartModel = require("./models/cart");

class CartsDao {
  async getAll() {
    return await cartModel.find().lean();
  }

  async getById(id) {
    return await cartModel
      .findOne({ _id: id })
      .populate("products.product")
      .lean();
  }

  async create(cart) {
    return await cartModel.create(cart);
  }

  async update(id, product) {
    return await cartModel.updateOne({ _id: id }, product);
  }

  async delete(id) {
    return await cartModel.deleteOne({ _id: id });
  }
}

module.exports = CartsDao;
