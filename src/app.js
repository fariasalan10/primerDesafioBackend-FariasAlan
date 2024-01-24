const express = require("express");
const server = express();
const ProductManager = require("./index.js");
server.use(express.urlencoded({ extended: true }));

server.get("/", (req, res) => {
  res.send("Hello World!");
});
const pm = new ProductManager("./src/products.json");

server.get("/products", async (req, res) => {
  let products = await pm.leerArchivo();

  if (req.query.limit) {
    products = products.slice(0, req.query.limit);
  }

  res.send(products);
});

server.get("/products/:pid", async (req, res) => {
  let products = await pm.leerArchivo();
  if (req.params.pid <= products.length) {
    let product = products.find((product) => product.id == req.params.pid);
    res.send(product);
  } else {
    return res.send({ error: "Product not found" });
  }
});

server.listen(8080, () => {
  console.log("Server listening on port 8080");
});
