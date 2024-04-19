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
      status: true,
    });
  }
  async getProducts({ limit = 10, page = 1, sort, query } = {}) {
    const skip = (page - 1) * limit;

    let queryOptions = {};
    if (query) {
      queryOptions = { category: query };
    }

    const sortOptions = {};
    if (sort) {
      if (sort === "asc" || sort === "desc") {
        sortOptions.price = sort === "asc" ? 1 : -1;
      }
    }

    const products = await productModel
      .find(queryOptions)
      .sort(sortOptions)
      .skip(skip)
      .limit(limit)
      .lean();
    const totalProducts = await productModel.countDocuments(queryOptions);
    const totalPages = Math.ceil(totalProducts / limit);
    const hasPrevPage = page > 1;
    const hasNextPage = page < totalPages;

    return {
      docs: products,
      totalPages,
      prevPage: hasPrevPage ? page - 1 : null,
      nextPage: hasNextPage ? page + 1 : null,
      page,
      hasNextPage,
      hasPrevPage,
      prevLink: hasPrevPage
        ? `http://localhost:8080/api/products?limit=${limit}&page=${
            page - 1
          }&sort=${sort}&query=${query}`
        : null,
      nextLink: hasNextPage
        ? `http://localhost:8080/api/products?limit=${limit}&page=${
            page + 1
          }&sort=${sort}&query=${query}`
        : null,
    };
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
