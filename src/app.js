const express = require("express");
const handlebars = require("express-handlebars");
const { Server } = require("socket.io");
const mongoose = require("mongoose");
const session = require("express-session");
const MongoStore = require("connect-mongo");

const ProductManager = require("./dao/dbManagers/productManager");
const pm = new ProductManager("./src/files/products.json");

const productsRouter = require("./routes/products.router");
const cartsRouter = require("./routes/carts.router");
const viewsRouter = require("./routes/views.router");
const sessionRouter = require("./routes/sessions.router");

const server = express();
const puerto = 8080;

const messageModel = require("./dao/models/messages");

//Mongoose
mongoose
  .connect(
    "mongodb+srv://fariasalan:Yy0i1kxIkMb8Ywdn@coderhousecluster.n7taqlj.mongodb.net/ecommerce"
  )
  .then(() => {
    console.log("Base de datos conectada");
  });

//Handlebars
server.engine("handlebars", handlebars.engine());
server.set("views", `${__dirname}/views`);
server.set("view engine", "handlebars");

//Express
server.use(express.static(`${__dirname}/public`));
server.use(express.urlencoded({ extended: true }));
server.use(express.json());

//Middlewares
server.use(
  session({
    store: MongoStore.create({
      mongoUrl:
        "mongodb+srv://fariasalan:Yy0i1kxIkMb8Ywdn@coderhousecluster.n7taqlj.mongodb.net/ecommerce",
      ttl: 600,
    }),
    secret: "coderhouse",
    resave: false,
    saveUninitialized: true,
  })
);

//Routers
server.use("/api/products", productsRouter);
server.use("/api/carts", cartsRouter);
server.use("/", viewsRouter);
server.use("/api/sessions", sessionRouter);

const serverHttp = server.listen(puerto, () => {
  console.log(`Server listening on port ${puerto}`);
});

//Socket
const io = new Server(serverHttp);

io.on("connection", async (socket) => {
  console.log("User connected");

  socket.on("new product", async (newProduct) => {
    let { title, description, price, thumbnail, code, stock } = newProduct;
    await pm.addProduct(title, description, price, thumbnail, code, stock);
    const products = await pm.getProducts();
    io.emit("list updated", { products });
  });

  socket.on("delete product", async (id) => {
    await pm.deleteProduct(id);
    const products = await pm.getProducts();
    io.emit("list updated", { products });
  });

  const data = await messageModel.find().lean();
  socket.emit("chat messages", { data });

  socket.on("new message", async (messageInfo) => {
    await messageModel.create(messageInfo);
    const data = await messageModel.find().lean();
    io.emit("chat messages", { data });
  });
});
