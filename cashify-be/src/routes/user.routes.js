const userControllers = require('../controllers/user.controllers');
const router = require('express').Router();

router.post('/login', userControllers.login);
router.post('/register', userControllers.register);

module.exports = router;

