const invoiceController = require("../controllers/invoice.controller");
const authMiddleware = require("../middlewares/auth.middleware");
const router = require("express").Router();

router.post("/create", authMiddleware.authenticate, invoiceController.create);
router.post("/pay", authMiddleware.authenticate,invoiceController.pay);
router.get("/status", authMiddleware.authenticate, authMiddleware.authorize("merchant"),invoiceController.status);
module.exports = router;    