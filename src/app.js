const express = require("express");
const handlebars = require("express-handlebars");
const { Server } = require("socket.io");

const productsRouter = require("./routes/products.router");
const cartsRouter = require("./routes/carts.router");

const server = express();
const puerto = 8080;

server.engine("handlebars", handlebars.engine());
server.set("views", "./views");
server.set("view engine", "handlebars");

server.use(express.static("./public"));
server.use(express.urlencoded({ extended: true }));
server.use(express.json());

server.use("/api/products", productsRouter);
server.use("/api/carts", cartsRouter);

server.listen(puerto, () => {
  console.log(`Server listening on port ${puerto}`);
});
