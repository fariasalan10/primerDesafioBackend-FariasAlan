const cartModel = require("./models/cart");

class CartsDao {
  async getAll() {
    return await cartModel.find().lean();
  }

  async getById(id) {
    return await cartModel.findOne({ _id: id }).populate("items.item").lean();
  }

  async create(item) {
    return await cartModel.create(item);
  }

  async update(id, item) {
    return await cartModel.updateOne({ _id: id }, item);
  }

  async delete(id) {
    return await cartModel.deleteOne({ _id: id });
  }
}

module.exports = CartsDao;
