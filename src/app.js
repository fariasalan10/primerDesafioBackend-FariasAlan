const express = require("express");
const server = express();
const puerto = 8080;
const productsRouter = require("./routes/products.router");
const cartsRouter = require("./routes/carts.router");

server.use(express.urlencoded({ extended: true }));
server.use(express.json());

server.use("/api/products", productsRouter);
server.use("/api/carts", cartsRouter);

server.listen(puerto, () => {
  console.log(`Server listening on port ${puerto}`);
});
