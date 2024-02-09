const { Router } = require("express");
const router = Router();
const ProductManager = require("../productManager");
const pm = new ProductManager("./src/files/products.json");

router.get("/", async (req, res) => {
  const products = await pm.getProducts();
  res.render("home", { products });
});

router.get("/realtimeproducts", async (req, res) => {
  const products = await pm.getProducts();
  res.render("realTimeProducts", { products });
});

module.exports = router;
