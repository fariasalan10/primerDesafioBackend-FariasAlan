const { productsService } = require("../repositories");
const CustomError = require("../utils/errorHandling/customError");
const ErrorTypes = require("../utils/errorHandling/errorTypes");
const { ProductErrorInfo } = require("../utils/errorHandling/info");

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
        res.status(404).json({ error: "Product not found" });
      }
    } catch (error) {
      console.error("Error al obtener producto:", error);
      res.status(500).json({ error: "Internal Server Error" });
    }
  }

  static async addProduct(req, res) {
    try {
      await productsService.create(req.body);
      const product = await productsService.getAll();
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
        res.status(404).json({ error: "Product not found" });
      }
    } catch (error) {
      console.error("Error al eliminar producto:", error);
      res.status(500).json({ error: "Internal Server Error" });
    }
  }
}

module.exports = ProductsController;
