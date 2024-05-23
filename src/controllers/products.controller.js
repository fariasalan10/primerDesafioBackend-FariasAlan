const { productsService } = require("../repositories");
const CustomError = require("../utils/errorHandling/customError");
const ErrorTypes = require("../utils/errorHandling/errorTypes");
const { idErrorInfo } = require("../utils/errorHandling/info");

class ProductsController {
  static async getAll(req, res, next) {
    try {
      let query = req.query;
      if (query) {
        let { docs, ...rest } = await productsService.getAll(query);
        res.send({ status: "success", payload: docs, ...rest });
      } else {
        throw new CustomError({
          name: "Products not found",
          cause: "Products not found",
          message: "Products not found",
          code: ErrorTypes.NOT_FOUND,
        });
      }
    } catch (error) {
      next(error);
    }
  }

  static async getById(req, res, next) {
    try {
      const product = await productsService.getById(req.params.pid);
      if (product) {
        res.status(200).json(product);
      } else {
        throw new CustomError({
          name: "Product not found",
          cause: idErrorInfo(req.params.pid),
          message: "Product not found. Id not valid or not exist",
          code: ErrorTypes.NOT_FOUND,
        });
      }
    } catch (error) {
      next(error);
    }
  }

  static async addProduct(req, res, next) {
    try {
      const { title, description, price, thumbnail, code, stock, status } =
        req.body;

      if (
        !title ||
        !description ||
        !price ||
        !thumbnail ||
        !code ||
        !stock ||
        !status
      ) {
        throw new CustomError({
          name: "missing fields",
          cause: ProductErrorInfo(req.body),
          message: "some fields are missing",
          code: ErrorTypes.INVALID_PARAMETERS,
        });
      }

      if (req.user.role == "premium") {
        req.body.owner = req.user.email;
      }

      await productsService.create(req.body);
      res.status(201).json({ status: "success", message: "Product created" });
    } catch (error) {
      next(error);
    }
  }

  static async updateProduct(req, res, next) {
    try {
      const id = req.params.pid;
      const product = req.body;
      if (id || product) {
        await productsService.update(id, product);
        res.status(200).json({ status: "success", message: "Product updated" });
      } else {
        throw new CustomError({
          name: "Product to update not found",
          cause: idErrorInfo(req.params.pid),
          message: "Product not found. Id not valid or not exist",
          code: ErrorTypes.NOT_FOUND,
        });
      }
    } catch (error) {
      next(error);
    }
  }

  static async deleteProduct(req, res, next) {
    try {
      const deleted = await productsService.delete(req.params.pid);
      if (deleted) {
        res.status(200).json({ status: "success", message: "Product deleted" });
      } else {
        throw new CustomError({
          name: "Product to delete not found",
          cause: idErrorInfo(req.params.pid),
          message: "Product not found. Id not valid or not exist",
          code: ErrorTypes.NOT_FOUND,
        });
      }
    } catch (error) {
      next(error);
    }
  }
}

module.exports = ProductsController;
