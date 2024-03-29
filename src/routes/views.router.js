const { Router } = require("express");
const router = Router();
const ProductManager = require("../dao/dbManagers/productManager");
const CartManager = require("../dao/dbManagers/cartManager");
const pm = new ProductManager("./src/files/products.json");
const cm = new CartManager("./src/files/carts.json");

const publicAcces = (req, res, next) => {
  if (req.session.user) {
    return res.redirect("/");
  } else {
    next();
  }
};

const privateAcces = (req, res, next) => {
  if (!req.session.user) {
    return res.redirect("/login");
  } else {
    next();
  }
};

router.get("/", privateAcces, async (req, res) => {
  const products = await pm.getProducts();
  res.render("products", { products, user: req.session.user });
});

router.get("/realtimeproducts", async (req, res) => {
  const products = await pm.getProducts();
  res.render("realTimeProducts", { products });
});

router.get("/chat", (req, res) => {
  res.render("chat", {});
});

router.get("/products", async (req, res) => {
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
});

router.get("/carts/:id", async (req, res) => {
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
});

router.get("/register", publicAcces, (req, res) => {
  res.render("register", {});
});

router.get("/login", publicAcces, (req, res) => {
  res.render("login", {});
});

module.exports = router;
