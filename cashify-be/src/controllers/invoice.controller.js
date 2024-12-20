const Invoice = require("../models/invoice.model");
const User = require("../models/user.model");

exports.create = async (req, res) => {
    if (!req.body.amount) {
        return res
        .status(400)
        .json({ success: false, message: "Amount is required" });
    }
    try {
        const { amount } = req.body;
        const merchantId = req.user._id;
        const merchant = await User.findById(merchantId);
        if (!merchant) {
            return res
            .status(400)
            .json({ success: false, message: "Merchant not found" });
        }
        const invoice = new Invoice({ amount, merchant: merchantId });
        await invoice.save();
        res.json({
            success: true,
            message: "Invoice created successfully",
            data: invoice,
        });
    } catch (error) {
        res.status(400).json({ success: false, message: error.message });
    }
}

exports.pay = async (req, res) => {
    if (!req.body.invoice_id) {
        return res
        .status(400)
        .json({ success: false, message: "Invoice ID is required" });
    }
    try {
        const { invoice_id } = req.body;
        const customerId = req.user._id;
        const customer = await User.findById(customerId);
        if (!customer) {
            return res
            .status(400)
            .json({ success: false, message: "Customer not found" });
        }
        const invoice = await Invoice.findById(invoice_id);
        if (!invoice) {
            return res
            .status(400)
            .json({ success: false, message: "Invoice not found" });
        }
        if(customer.balance < invoice.amount) {
            return res
            .status(400)
            .json({ success: false, message: "Insufficient balance" });
        }
        if (invoice.status === "paid") {
            return res
            .status(400)
            .json({ success: false, message: "Invoice already paid" });
        }
        const merchant = await User.findById(invoice.merchant);
        merchant.balance = parseInt(merchant.balance) + parseInt(invoice.amount);
        customer.balance = parseInt(customer.balance) - parseInt(invoice.amount);
        invoice.status = "paid";
        await User.updateOne({ _id: customerId }, { balance: customer.balance });
        await Invoice.updateOne({ _id: invoice_id }, { status: invoice.status });
        await User.updateOne({ _id: invoice.merchant }, { balance: merchant.balance });
        res.json({
            success: true,
            message: "Invoice paid successfully",
            data: {invoice: invoice, user: customer},
        });
    } catch (error) {
        res.status(400).json({ success: false, message: error.message });
    }
}

exports.status = async (req, res) => {
    if (!req.query.invoice_id) {
        return res
        .status(400)
        .json({ success: false, message: "Invoice ID is required" });
    }
    try {
        const { invoice_id } = req.query;
        const invoice = await Invoice.findById(invoice_id);
        if (!invoice) {
            return res
            .status(400)
            .json({ success: false, message: "Invoice not found" });
        }
        if(req.user._id != invoice.merchant) {
            return res
            .status(400)
            .json({ success: false, message: "Unauthorized" });
        }
        const merchant = await User.findById(invoice.merchant);
        res.json({
            success: true,
            message: "Invoice status",
            data: {invoice: invoice, user: merchant},
        });
    } catch (error) {
        res.status(400).json({ success: false, message: error.message });
    }
}