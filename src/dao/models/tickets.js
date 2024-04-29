const mongoose = require("mongoose");

const ticketsSchema = new mongoose.Schema({
  code: { type: String, required: true },
  purchase_datetime: { type: String, required: true },
  amount: { type: Number, required: true },
  purchaser: { type: String, required: true },
});

const ticketModel = mongoose.model("tickets", ticketsSchema);

module.exports = ticketModel;
