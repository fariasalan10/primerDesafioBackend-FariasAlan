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
    type: mongoose.Schema.Types.ObjectId,
    ref: "carts",
  },
  role: {
    type: String,
    enum: ["usuario", "admin"],
    default: "usuario",
  },
  documents: {
    type: [
      {
        name: String,
        reference: String,
      },
    ],
    default: [],
  },
  last_connection: {
    type: String,
    default: null,
  },
  profile_picture: {
    type: String,
    default: null,
  },
});
const userModel = mongoose.model("users", userSchema);

module.exports = userModel;
