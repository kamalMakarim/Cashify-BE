const mongoose = require("mongoose");

const InvoiceSchema = new mongoose.Schema({
    merchant: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "User",
        required: true
    },
    amount: {
        type: Number,
        required: true
    },
    status: {
        type: String,
        enum: ["pending", "paid"],
        default: "pending"
    }
});

module.exports = mongoose.model("Invoice", InvoiceSchema);