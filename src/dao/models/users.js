const mongoose = require("mongoose");

const userSchema = new mongoose.Schema({
  first_name: {
    type: String,
  },
  last_name: {
    type: String,
  },
  email: {
    type: String,
    unique: true,
  },
  age: {
    type: Number,
  },
  password: {
    type: String,
  },
  cart: {
    type: mongoose.SchemaTypes.ObjectId,
    ref: "carts",
  },
  role: {
    type: String,
    enum: ["user", "admin"],
    default: "user",
  },
});
const userModel = mongoose.model("users", userSchema);

module.exports = userModel;
