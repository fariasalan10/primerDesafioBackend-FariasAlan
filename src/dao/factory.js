const mongoose = require("mongoose");
const { mongoConnectionLink, persistence } = require("../config/config");

let CartsDao;
let ProductsDao;
let UsersDao;
let TicketsDao;

switch (persistence) {
  case "MONGO":
    mongoose.connect(mongoConnectionLink).then(() => {
      console.log("MongoDB connected");
    });
    CartsDao = require("./carts.dao");
    ProductsDao = require("./products.dao");
    UsersDao = require("./users.dao");
    TicketsDao = require("./tickets.dao");
    break;

  case "MEMORY":
    CartsDao = require("./memory/carts.memory");
    ProductsDao = require("./memory/products.memory");
    UsersDao = require("./memory/users.memory");
    TicketsDao = require("./memory/tickets.memory");
    break;
}

module.exports = { CartsDao, ProductsDao, UsersDao, TicketsDao };
