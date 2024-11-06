const mongoose = require("mongoose");

const TransactionSchema = new mongoose.Schema({
  user: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User",
    required: true,
  },
  amount: {
    type: Number,
    required: true,
  },
  type: {
    type: String,
    enum: ["deposit", "withdraw"],
    required: true,
  },
  invoice: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Invoice",
  },
  trash: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Trash",
  },
});

module.exports = mongoose.model("Transaction", TransactionSchema);