const ticketModel = require("./models/ticket");

class TicketsDao {
  async getAll() {
    return await ticketModel.find().lean();
  }

  async getById(id) {
    return await ticketModel.findOne({ _id: id }).populate("items.item").lean();
  }

  async create(item) {
    return await ticketModel.create(item);
  }

  async update(id, item) {
    return await ticketModel.updateOne({ _id: id }, item);
  }

  async delete(id) {
    return await ticketModel.deleteOne({ _id: id });
  }
}

module.exports = TicketsDao;
