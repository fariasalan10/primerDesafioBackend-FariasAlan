const userModel = require("./models/users");

class UsersDao {
  async getAll() {
    return await userModel.find().lean();
  }

  async getById(id) {
    return await userModel
      .findOne({ _id: id })
      .populate("products.product")
      .lean();
  }

  async getByProperty(property, name) {
    let opts = {};
    opts[property] = name;
    return await userModel.findOne(opts).lean();
  }

  async create(user) {
    return await userModel.create(user);
  }

  async update(id, user) {
    return await userModel.updateOne({ _id: id }, user);
  }

  async delete(id) {
    return await userModel.deleteOne({ _id: id });
  }
}

module.exports = UsersDao;
