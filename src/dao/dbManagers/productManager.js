const productModel = require("../models/products");

class ProductManager {
  async addProduct(title, description, price, thumbnail, code, stock) {
    await productModel.create({
      title,
      description,
      price,
      thumbnail,
      code,
      stock,
    });
  }
  async getProducts() {
    const products = await productModel.find().lean();
    return products;
  }
  async getProductsById(id) {
    const products = await productModel.find({ _id: id }).lean();
    return products[0];
  }

  async updateProduct(id, updatedProperties) {
    await productModel.updateOne({ _id: id }, updatedProperties);
  }

  async deleteProduct(id) {
    await productModel.deleteOne({ _id: id });
  }
}

module.exports = ProductManager;
