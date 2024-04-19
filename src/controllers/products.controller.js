const ProductsService = require("../services/products.service");

const productService = new ProductsService();

class ProductsController {
  static async getAll(req, res) {
    let query = req.query;
    try {
      let { docs, ...rest } = await productService.getAll(query);
      res.send({ status: "success", payload: docs, ...rest });
    } catch (error) {
      console.log("Error al obtener los productos:", error);
      res.status(500).send("Error al obtener los productos");
    }
  }

  static async getById(req, res) {
    try {
      const product = await productService.getById(req.params.pid);
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
      await productService.create(req.body);
      const product = await productService.getAll();
      res.status(201).json({ status: "success", message: "Product created" });
    } catch (error) {
      console.error("Error al crear producto:", error);
      res.status(500).json({ error: "Internal Server Error" });
    }
  }

  static async updateProduct(req, res) {
    try {
      await productService.update(req.params.pid, req.body);
      res.status(200).json({ status: "success", message: "Product updated" });
    } catch (error) {
      console.error("Error al actualizar producto:", error);
      res.status(500).json({ error: "Internal Server Error" });
    }
  }

  static async deleteProduct(req, res) {
    try {
      const deleted = await productService.delete(req.params.pid);
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
