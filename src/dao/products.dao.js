const productModel = require("./models/products");

class ProductsDao {
  async getAll(options, paginationOptions) {
    if (options && paginationOptions) {
      return await productModel.paginate(options, paginationOptions);
    }
    return await productModel.find().lean();
  }

  async getById(id) {
    return await productModel.findOne({ _id: id });
  }

  async create(product) {
    return await productModel.create(product);
  }

  async update(id, product) {
    return await productModel.updateOne({ _id: id }, product);
  }

  async delete(id) {
    return await productModel.deleteOne({ _id: id });
  }
}

module.exports = ProductsDao;
