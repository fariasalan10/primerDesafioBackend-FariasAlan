const { cartsService, productsService } = require("../repositories");

class CartsController {
  static async create(req, res) {
    try {
      await cartsService.create();
      res.send({ status: "success" });
    } catch (error) {
      console.error("Error al crear carrito:", error);
      res.status(500).json({ error: "Internal Server Error" });
    }
  }

  static async getById(req, res) {
    try {
      const id = req.params.id;
      const cart = await cartsService.getById(id);
      res.send(cart);
    } catch (error) {
      console.error("Error al obtener carrito:", error);
      res.status(500).json({ error: "Internal Server Error" });
    }
  }

  static async getAll(req, res) {
    try {
      const carts = await cartsService.getAll();
      res.send(carts);
    } catch (error) {
      console.error("Error al obtener carritos:", error);
      res.status(500).json({ error: "Internal Server Error" });
    }
  }

  static async addProductToCart(req, res) {
    try {
      const cartId = req.params.id;
      const productId = req.params.pid;
      const cart = await cartsService.getById(cartId);
      const product = await productsService.getById(productId);

      if (product) {
        await cartsService.addProduct(cartId, productId);
        res.send({ status: "success", message: "Product added to cart" });
      } else {
        res.status(404).json({ error: "Product not found" });
      }
    } catch (error) {
      console.error("Error al agregar producto al carrito:", error);
    }
  }

  static async deleteProduct(req, res) {
    try {
      const updatedCart = await cartsService.deleteProductById(
        req.params.id,
        req.params.pid
      );
      res
        .status(200)
        .json({ status: "success", message: "Product deleted", updatedCart });
    } catch (error) {
      console.error("Error al eliminar producto del carrito:", error);
    }
  }

  static async update(req, res) {
    try {
      const updatedCart = await cartsService.updateCartProducts(
        req.params.id,
        req.body
      );
      res
        .status(200)
        .json({ status: "success", message: "Cart updated", updatedCart });
    } catch (error) {
      console.error("Error al actualizar carrito:", error);
    }
  }

  static async updateQuantityProducts(req, res) {
    try {
      const updatedCart = await cartsService.updateProductQuantity(
        req.params.id,
        req.params.pid,
        req.body.quantity
      );
      res
        .status(200)
        .json({ status: "success", message: "Quantity updated", updatedCart });
    } catch (error) {
      console.error("Error al actualizar cantidad del carrito:", error);
    }
  }

  static async delete(req, res) {
    try {
      const updatedCart = await cartsService.deleteAllProducts(req.params.id);
      res
        .status(200)
        .json({ status: "success", message: "Cart cleaned", updatedCart });
    } catch (error) {
      console.error("Error al limpiar carrito:", error);
    }
  }

  static async purchase(req, res) {
    const { id } = req.params;
    try {
      const remainderProducts = await cartsService.purchase(id, req.user.email);
      res.send({ status: "success", payload: remainderProducts });
    } catch (error) {
      return res
        .status(error.status || 500)
        .send({ status: "error", error: error.message });
    }
  }
}

module.exports = CartsController;
