const { productsService, cartsService } = require("../repositories");

class ViewsController {
  static async getHome(req, res) {
    try {
      const products = await productsService.getAll();
      const cart = await cartsService.getById(req.user.cart);
      res.render("products", { products, cart, user: req.session.user });
    } catch (error) {
      res
        .status(error.status || 500)
        .send({ status: "error", error: error.message });
    }
  }

  static async getRealTimeProducts(req, res) {
    try {
      const products = await productsService.getAll();
      res.render("realTimeProducts", { products, user: req.session.user });
    } catch (error) {
      res
        .status(error.status || 500)
        .send({ status: "error", error: error.message });
    }
  }

  static async getChat(req, res) {
    try {
      res.render("chat", { user: req.session.user });
    } catch (error) {
      res
        .status(error.status || 500)
        .send({ status: "error", error: error.message });
    }
  }

  static async getProducts(req, res) {
    try {
      const { docs, ...rest } = await productsService.getAll(req.query);

      const cart = await cartsService.getById(req.user.cart);

      res.render("products", {
        user: req.session.user,
        products: docs,
        style: "/css/products.css",
        cart,
        ...rest,
      });
    } catch (error) {
      res
        .status(error.status || 500)
        .send({ status: "error", error: error.message });
    }
  }

  static async getProductById(req, res) {
    try {
      const product = await productsService.getById(req.params.pid);
      res.render("products", { product, style: "../public/css/products.css" });
    } catch (error) {
      res
        .status(error.status || 500)
        .send({ status: "error", error: error.message });
    }
  }

  static async getCart(req, res) {
    try {
      const cart = await cartsService.getById(req.params.id);
      if (cart) {
        const productsInCart = cart.products.map((product) => ({
          product: product.product.toObject(),
          quantity: product.quantity,
        }));
        res.render("cart", { products: productsInCart });
      }
      res.status(404).send("Carrito no encontrado");
      console.log("Error al obtener el carrito:", error);
    } catch (error) {
      console.log("Error al obtener el carrito:", error);
      res.status(500).send("Carrito no encontrado");
    }
  }

  static async getRegister(req, res) {
    res.render("register", {});
  }

  static async getLogin(req, res) {
    res.render("login", {});
  }

  static async getResetPassword(req, res) {
    res.render("resetPassword", {});
  }
}

module.exports = ViewsController;
