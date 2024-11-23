const userControllers = require('../controllers/user.controller');
const authControllers = require('../controllers/auth.controller')
const router = require('express').Router();

router.post('/login', authControllers.login);
router.post('/register', userControllers.register);

module.exports = router;

