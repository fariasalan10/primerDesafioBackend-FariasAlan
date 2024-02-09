const express = require("express");
const handlebars = require("express-handlebars");
const { Server } = require("socket.io");

const ProductManager = require("./productManager");
const pm = new ProductManager("./src/files/products.json");

const productsRouter = require("./routes/products.router");
const cartsRouter = require("./routes/carts.router");
const viewsRouter = require("./routes/views.router");

const server = express();
const puerto = 8080;

//Handlebars
server.engine("handlebars", handlebars.engine());
server.set("views", `${__dirname}/views`);
server.set("view engine", "handlebars");

//Express
server.use(express.static(`${__dirname}/public`));
server.use(express.urlencoded({ extended: true }));
server.use(express.json());

//Routers
server.use("/api/products", productsRouter);
server.use("/api/carts", cartsRouter);
server.use("/", viewsRouter);

const serverHttp = server.listen(puerto, () => {
  console.log(`Server listening on port ${puerto}`);
});

//Socket
const io = new Server(serverHttp);

io.on("connection", (socket) => {
  console.log("User connected");

  socket.on("new product", async (newProduct) => {
    await pm.addProduct(newProduct);
    const products = await pm.getProducts();
    io.emit("list updated", { products });
  });

  socket.on("delete product", async (id) => {
    await pm.deleteProduct(id);
    const products = await pm.getProducts();
    io.emit("list updated", { products });
  });
});
