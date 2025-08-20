const express = require('express');
const router = express.Router();
const { validateRegister, validateLogin, register, login } = require('../controllers/authController');

router.post('/register', validateRegister, register);
router.post('/login', validateLogin, login);

module.exports = router;


