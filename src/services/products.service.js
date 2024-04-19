const productsDao = require("../dao/products.dao");

class ProductsService {
  constructor() {
    this.dao = new productsDao();
  }

  async getAll(queryParams = null) {
    let result = [];
    let options = {};

    if (queryParams) {
      let paginationOptions = {
        page: queryParams.page || 1,
        limit: queryParams.limit || 10,
        lean: true,
      };
      if (queryParams.sort) {
        paginationOptions.sort = {
          price: queryParams.sort == "asc" ? 1 : -1,
        };
      }

      if (queryParams.query) {
        options = this.getOptionsObject(queryParams.query);
      }

      result = await this.dao.getAll(options, paginationOptions);
      if (
        !paginationOptions.page ||
        result.totalPages < paginationOptions.page ||
        paginationOptions.page < 1
      ) {
        throw { message: "Page not found", status: 400 };
      }
    } else {
      result = await this.dao.getAll();
    }
    let extraLinkParams = "";
    if (queryParams) {
      Object.keys(queryParams).forEach((key) => {
        if (key != "page") {
          extraLinkParams += `&${key}=${queryParams[key]}`;
        }
      });
    }

    result.prevLink = result.hasPrevPage
      ? `http://localhost:8080/api/products?page=${result.prevPage}${extraLinkParams}`
      : "";

    result.nextLink = result.hasNextPage
      ? `http://localhost:8080/api/products?page=${result.nextPage}${extraLinkParams}`
      : "";

    return result;
  }

  async getById(id) {
    return await this.dao.getById(id);
  }

  async create(product) {
    return await this.dao.create(product);
  }

  async update(id, product) {
    const found = await this.dao.getById(id);

    if (!found) {
      return null;
    }
    return await this.dao.update(id, product);
  }

  async delete(id) {
    const product = await this.dao.getById(id);

    if (!product) {
      return null;
    }
    return await this.dao.delete(id);
  }

  getOptionsObject(query) {
    try {
      return JSON.parse(query);
    } catch (error) {
      return {
        $or: [
          { title: new RegExp(query) },
          { description: new RegExp(query) },
          { price: new RegExp(query) },
          { code: new RegExp(query) },
          { thumbnail: new RegExp(query) },
          { stock: new RegExp(query) },
          { status: new RegExp(query) },
        ],
      };
    }
  }
}

module.exports = ProductsService;
