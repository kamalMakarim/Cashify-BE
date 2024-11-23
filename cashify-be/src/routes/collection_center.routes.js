const collectionCenterController = require('../controllers/collection_center.controller');
const router = require('express').Router();

router.post('/create', collectionCenterController.create);

module.exports = router;
