const { Router } = require("express");
const CartsController = require("../controllers/carts.controller");
const router = Router();

router.post("/", CartsController.createCart);

router.get("/:id", CartsController.getCartById);

router.post("/:id/product/:pid", CartsController.addProductToCart);

router.delete("/:id/product/:pid", CartsController.deleteProductFromCart);

router.put("/:id", CartsController.updateCart);

router.put("/:id/product/:pid", CartsController.updateQuantityProducts);

router.delete("/:id", CartsController.deleteCart);

module.exports = router;
