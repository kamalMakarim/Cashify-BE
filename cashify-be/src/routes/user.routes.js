const userControllers = require('../controllers/user.controller');
const authControllers = require('../controllers/auth.controller');
const authMiddleware = require('../middlewares/auth.middleware');
const router = require('express').Router();

router.post('/login', authControllers.login);
router.post('/register', userControllers.register);
router.post('/transfer',  authMiddleware.authenticate, userControllers.transfer);

module.exports = router;

