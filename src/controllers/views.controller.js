const ProductManager = require("../dao/dbManagers/productManager");
const CartManager = require("../dao/dbManagers/cartManager");

const cm = new CartManager("../files/carts.json");
const pm = new ProductManager("../files/products.json");

class ViewsController {
  static async getHome(req, res) {
    const products = await pm.getProducts();
    res.render("products", { products, user: req.session.user });
  }

  static async getRealTimeProducts(req, res) {
    const products = await pm.getProducts();
    res.render("realTimeProducts", { products });
  }

  static async getChat(req, res) {
    res.render("chat", {});
  }

  static async getProducts(req, res) {
    try {
      const { page = 1, limit = 2 } = req.query;
      const products = await pm.getProducts({
        page: parseInt(page),
        limit: parseInt(limit),
      });
      const newArray = products.docs.map((product) => {
        const { _id, ...rest } = product.toObject();
        return rest;
      });
      res.render("products", {
        products: newArray,
        hasPrevPage: products.hasPrevPage,
        hasNextPage: products.hasNextPage,
        prevPage: products.prevPage,
        nextPage: products.nextPage,
        currentPage: products.page,
        totalPages: products.totalPages,
      });
    } catch (error) {
      console.log("Error al obtener los productos:", error);
      res.status(500).send("Error al obtener los productos");
    }
  }

  static async getCart(req, res) {
    try {
      const cart = await cm.getCart(req.params.id);
      if (cart) {
        const productsInCart = cart.products.map((item) => ({
          product: item.product.toObject(),
          quantity: item.quantity,
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
