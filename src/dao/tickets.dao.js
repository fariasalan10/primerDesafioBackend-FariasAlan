const ticketModel = require("./models/ticket");

class TicketsDao {
  async getAll() {
    return await ticketModel.find().lean();
  }

  async getById(id) {
    return await ticketModel
      .findOne({ _id: id })
      .populate("products.product")
      .lean();
  }

  async create(product) {
    return await ticketModel.create(product);
  }

  async update(id, product) {
    return await ticketModel.updateOne({ _id: id }, product);
  }

  async delete(id) {
    return await ticketModel.deleteOne({ _id: id });
  }
}

module.exports = TicketsDao;
