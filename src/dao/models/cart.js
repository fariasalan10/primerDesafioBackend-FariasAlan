const mongoose = require("mongoose");

const cartSchema = new mongoose.Schema({
  items: [
    {
      item: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Item",
        required: true,
      },
      quantity: {
        type: Number,
        required: true,
      },
    },
  ],
});

cartSchema.pre("findOne", function (next) {
  this.populate("items.item", "_id title price");
  next();
});

const cartModel = mongoose.model("carts", cartSchema);

module.exports = cartModel;
