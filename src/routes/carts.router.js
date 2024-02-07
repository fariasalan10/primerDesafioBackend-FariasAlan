const { Router } = require("express");
const router = Router();
const ProductManager = require("../productManager");
const CartManager = require("../cartManager");
const pm = new ProductManager("./src/files/products.json");
const cm = new CartManager("./src/files/carts.json");

router.post("/", async (req, res) => {
  try {
    await cm.addCart();
    res.status(201).json({ status: "success" });
  } catch (error) {
    console.error("Error al crear carrito:", error);
    res.status(500).json({ error: "Internal Server Error" });
  }
});

router.get("/:id", async (req, res) => {
  try {
    const cart = await cm.getCart(req.params.id);
    if (cart) {
      res.status(200).json(cart);
    } else {
      res.status(404).json({ error: "Cart not found" });
    }
  } catch (error) {
    console.error("Error al obtener carrito:", error);
    res.status(500).json({ error: "Internal Server Error" });
  }
});

router.post("/:id/product/:pid", async (req, res) => {
  const cartId = req.params.id;
  const productId = req.params.pid;

  try {
    const cart = await cm.getCart(cartId);

    if (!cart) {
      res.status(404).json({ error: "Cart not found" });
      return;
    }

    await cm.addProduct(cartId, productId);
    res.status(200).json({ status: "success" });
  } catch (error) {
    console.error("Error al agregar producto al carrito:", error);
    res.status(500).json({ error: "Internal Server Error" });
  }
});

module.exports = router;
