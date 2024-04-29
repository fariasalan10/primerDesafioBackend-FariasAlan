const { cartsService } = require("../repositories");

class CartsController {
  static async createCart(req, res) {
    try {
      await cartsService.create();
      res.status(201).json({ status: "success" });
    } catch (error) {
      console.error("Error al crear carrito:", error);
      res.status(500).json({ error: "Internal Server Error" });
    }
  }

  static async getCartById(req, res) {
    try {
      const cart = await cartsService.getById(req.params.id);
      if (cart) {
        res.status(200).json(cart);
      } else {
        res.status(404).json({ error: "Cart not found" });
      }
    } catch (error) {
      console.error("Error al obtener carrito:", error);
      res.status(500).json({ error: "Internal Server Error" });
    }
  }

  static async addProductToCart(req, res) {
    const cartId = req.params.id;
    const productId = req.params.pid;

    try {
      const cart = await cartsService.getById(cartId);

      if (!cart) {
        res.status(404).json({ error: "Cart not found" });
        return;
      }

      await cartsService.addItem(cartId, productId);
      res.status(200).json({ status: "success" });
    } catch (error) {
      console.error("Error al agregar producto al carrito:", error);
      res.status(500).json({ error: "Internal Server Error" });
    }
  }

  static async deleteProductFromCart(req, res) {
    try {
      const updatedCart = await cartsService.deleteItemById(
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

  static async updateCart(req, res) {
    try {
      const updatedCart = await cartsService.update(req.params.id, req.body);
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

  static async deleteCart(req, res) {
    try {
      const updatedCart = await cartsService.deleteAllProducts(req.params.id);
      res
        .status(200)
        .json({ status: "success", message: "Cart cleaned", updatedCart });
    } catch (error) {
      console.error("Error al limpiar carrito:", error);
    }
  }
}

module.exports = CartsController;
