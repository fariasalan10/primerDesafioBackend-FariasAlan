const { Router } = require("express");
const router = Router();
const ProductManager = require("../dao/dbManagers/productManager");
const pm = new ProductManager("./src/files/products.json");

router.get("/", async (req, res) => {
  try {
    const { limit = 10, page = 1, sort, query } = req.query;
    const products = await pm.getProducts({
      limit: parseInt(limit),
      page: parseInt(page),
      sort,
      query,
    });

    res.status(200).json({
      status: "success",
      payload: products,
      totalPages: products.totalPages,
      prevPage: products.prevPage,
      nextPage: products.nextPage,
      page: products.page,
      hasPrevPage: products.hasPrevPage,
      hasNextPage: products.hasNextPage,
      prevLink: products.hasPrevPage
        ? `http://localhost:8080/api/products?limit=${limit}&page=${products.prevPage}&sort=${sort}&query=${query}`
        : null,
      nextLink: products.hasNextPage
        ? `http://localhost:8080/api/products?limit=${limit}&page=${products.nextPage}&sort=${sort}&query=${query}`
        : null,
    });
  } catch (error) {
    console.error("Error al obtener productos:", error);
    res.status(500).json({ error: "Internal Server Error" });
  }
});

router.get("/:pid", async (req, res) => {
  try {
    const product = await pm.getProductsById(req.params.pid);
    if (product) {
      res.status(200).json(product);
    } else {
      res.status(404).json({ error: "Product not found" });
    }
  } catch (error) {
    console.error("Error al obtener producto:", error);
    res.status(500).json({ error: "Internal Server Error" });
  }
});

router.post("/", async (req, res) => {
  try {
    await pm.addProduct(
      req.body.title,
      req.body.description,
      req.body.price,
      req.body.thumbnail,
      req.body.code,
      req.body.stock
    );
    res.status(201).json({ status: "success", message: "Product created" });
  } catch (error) {
    console.error("Error al crear producto:", error);
    res.status(500).json({ error: "Internal Server Error" });
  }
});

router.put("/:pid", async (req, res) => {
  try {
    await pm.updateProduct(req.params.pid, req.body);
    res.status(200).json({ status: "success", message: "Product updated" });
  } catch (error) {
    console.error("Error al actualizar producto:", error);
    res.status(500).json({ error: "Internal Server Error" });
  }
});

router.delete("/:pid", async (req, res) => {
  try {
    const deleted = await pm.deleteProduct(req.params.pid);
    if (deleted) {
      res.status(200).json({ status: "success", message: "Product deleted" });
    } else {
      res.status(404).json({ error: "Product not found" });
    }
  } catch (error) {
    console.error("Error al eliminar producto:", error);
    res.status(500).json({ error: "Internal Server Error" });
  }
});

module.exports = router;
