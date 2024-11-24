const trashController = require("../controllers/trash.controller");
const authMiddleware = require("../middlewares/auth.middleware");
const router = require("express").Router();

router.post("/create", trashController.create);
router.post("/claim", authMiddleware.authenticate, trashController.claim);
router.get("/user", trashController.findUserTrash);

module.exports = router;
