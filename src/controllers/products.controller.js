const { productsService } = require("../repositories");
const CustomError = require("../utils/errorHandling/customError");
const ErrorTypes = require("../utils/errorHandling/errorTypes");
const { idErrorInfo } = require("../utils/errorHandling/info");

class ProductsController {
  static async getAll(req, res) {
    let query = req.query;
    try {
      let { docs, ...rest } = await productsService.getAll(query);
      res.send({ status: "success", payload: docs, ...rest });
    } catch (error) {
      console.log("Error al obtener los productos:", error);
      res.status(500).send("Error al obtener los productos");
    }
  }

  static async getById(req, res) {
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

  static async addProduct(req, res) {
    try {
      await productsService.create(req.body);
      res.status(201).json({ status: "success", message: "Product created" });
    } catch (error) {
      console.error("Error al crear producto:", error);
      res.status(500).json({ error: "Internal Server Error" });
    }
  }

  static async updateProduct(req, res) {
    try {
      await productsService.update(req.params.pid, req.body);
      res.status(200).json({ status: "success", message: "Product updated" });
    } catch (error) {
      console.error("Error al actualizar producto:", error);
      res.status(500).json({ error: "Internal Server Error" });
    }
  }

  static async deleteProduct(req, res) {
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
