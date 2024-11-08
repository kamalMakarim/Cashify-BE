const trashController = require("../controllers/trash.controller");
const router = require("express").Router();

router.post("/create", trashController.create);
router.post("/claim", trashController.claim);
router.get("/user", trashController.findUserTrash);

module.exports = router;
