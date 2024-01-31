const { Router } = require("express");
const router = Router();
const ProductManager = require("../index");
const pm = new ProductManager("./src/products.json");

router.get("/", async (req, res) => {
  let products = await pm.getProducts();

  const { limit } = req.query;
  if (limit) {
    products = products.slice(0, limit);
  }

  res.send({ products: products });
});

router.get("/:pid", async (req, res) => {
  let products = await pm.leerArchivo();
  if (req.params.pid <= products.length) {
    let product = products.find((product) => product.id == req.params.pid);
    res.send(product);
  } else {
    return res.send({ error: "Product not found" });
  }
});

router.post("/", async (req, res) => {
  await pm.addProduct(
    req.body.title,
    req.body.description,
    req.body.price,
    req.body.thumbnail,
    req.body.code,
    req.body.stock
  );
  res.send({ status: "success", message: "Product created" });
});

router.put("/:pid", async (req, res) => {
  await pm.updateProduct(req.params.pid, req.body);
  res.send({ status: "success", message: "Product updated" });
});

router.delete("/:pid", async (req, res) => {
  await pm.deleteProduct(req.params.pid);
  res.send({ status: "success", message: "Product deleted" });
});

module.exports = router;
