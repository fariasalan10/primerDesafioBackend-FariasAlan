const { Router } = require("express");
const router = Router();
const ProductManager = require("../index");
const CartManager = require("../indexCarts");
const pm = new ProductManager("./src/carts.json");
const cm = new CartManager("./src/carts.json");

router.post("/", async (req, res) => {
  await pm.addProduct();
  res.send({ status: "success" });
});

router.get("/:pid", async (req, res) => {
  let products = await pm.leerArchivo();
  if (req.params.pid <= products.length) {
    let product = products.find((product) => product.id == req.params.pid);
    res.send(product);
  } else {
    return res.send({ error: "Cart not found" });
  }
});
router.post("/:id/product/:pid", async (req, res) => {
  const id = req.params.id;
  const itemId = req.params.pid;

  const cart = await cm.getCart(id);
  const item = await pm.getProductsById(itemId);
  if (!cart) {
    res.status(400).send("cart does not exist");
  }

  pm.addProduct(id, itemId);

  res.send({ status: "success" });
});

module.exports = router;
