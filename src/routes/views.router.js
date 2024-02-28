const { Router } = require("express");
const router = Router();
const ProductManager = require("../dao/dbManagers/productManager");
const pm = new ProductManager("./src/files/products.json");

router.get("/", async (req, res) => {
  const products = await pm.getProducts();
  res.render("home", { products });
});

router.get("/realtimeproducts", async (req, res) => {
  const products = await pm.getProducts();
  res.render("realTimeProducts", { products });
});

router.get("/chat", (req, res) => {
  res.render("chat", {});
});

module.exports = router;
