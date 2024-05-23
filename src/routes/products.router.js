const { Router } = require("express");
const ProductsController = require("../controllers/products.controller");
const checkRole = require("../middlewares/checkRole.middleware");
const router = Router();

router.get("/", ProductsController.getAll);

router.get("/:pid", ProductsController.getById);

router.post(
  "/",
  checkRole(["admin", "premium"]),
  ProductsController.addProduct
);

router.put("/:pid", checkRole(["admin"]), ProductsController.updateProduct);

router.delete("/:pid", checkRole(["admin"]), ProductsController.deleteProduct);

module.exports = router;
