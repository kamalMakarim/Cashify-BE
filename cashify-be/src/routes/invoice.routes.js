const invoiceController = require("../controllers/invoice.controller");
const authMiddleware = require("../middlewares/auth.middleware");
const router = require("express").Router();

router.post("/create", authMiddleware.authenticate, invoiceController.create);
router.post("/pay", authMiddleware.authenticate, authMiddleware.authorize("merchant"),invoiceController.pay);

module.exports = router;