const express = require("express");
const handlebars = require("express-handlebars");
const { Server } = require("socket.io");
const session = require("express-session");
const MongoStore = require("connect-mongo");
const passport = require("passport");
const initializePassport = require("./config/passport.config");

const ProductManager = require("./dao/dbManagers/productManager");
const pm = new ProductManager("./src/files/products.json");

const productsRouter = require("./routes/products.router");
const cartsRouter = require("./routes/carts.router");
const viewsRouter = require("./routes/views.router");
const sessionRouter = require("./routes/sessions.router");
const { mockRouter } = require("./routes/mock.router");
const { loggerTestRouter } = require("./routes/loggerTest.router");

const messageModel = require("./dao/models/messages");
const { mongoConnectionLink, sessionSecret } = require("./config/config");
const errorHandler = require("./middlewares/errorHandling.middleware");
const checkRole = require("./middlewares/checkRole.middleware");
const addLogger = require("./middlewares/addLogger.middleware");
const port = 8080;

const server = express();

//Handlebars
server.engine("handlebars", handlebars.engine());
server.set("views", `${__dirname}/views`);
server.set("view engine", "handlebars");

//Express
server.use(express.static(`${__dirname}/public`));
server.use(express.urlencoded({ extended: true }));
server.use(express.json());

//Sessions
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

//Passport
initializePassport();
server.use(passport.initialize());
server.use(passport.session());

server.use(addLogger);

//Routers
server.use("/api/products", productsRouter);
server.use("/api/carts", cartsRouter);
server.use("/", viewsRouter);
server.use("/api/sessions", sessionRouter);
server.use("/api/mock", mockRouter);
server.use("/api/logger", loggerTestRouter);

const serverHttp = server.listen(port, () => {
  console.log(`Server listening on port ${port}`);
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

//Middlewares
server.use(errorHandler);
