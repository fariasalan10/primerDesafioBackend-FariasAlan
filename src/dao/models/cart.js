const mongoose = require("mongoose");

const cartSchema = new mongoose.Schema({
  items: {
    type: [{ item: String, quantity: Number }],
    default: [],
  },
});

const cartModel = mongoose.model("carts", cartSchema);

module.exports = cartModel;
