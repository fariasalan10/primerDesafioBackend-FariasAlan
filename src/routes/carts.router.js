const { Router } = require("express");
const CartsController = require("../controllers/carts.controller");
const checkRole = require("../middlewares/checkRole.middleware");
const router = Router();

router.post("/", CartsController.create);

router.get("/:id", CartsController.getById);

router.post(
  "/:id/product/:pid",
  checkRole("usuario"),
  CartsController.addProductToCart
);

router.delete("/:id/product/:pid", CartsController.deleteProduct);

router.put("/:id", CartsController.update);

router.put("/:id/product/:pid", CartsController.updateQuantityProducts);

router.delete("/:id", CartsController.delete);

router.get("/:id/purchase", CartsController.purchase);

module.exports = router;
