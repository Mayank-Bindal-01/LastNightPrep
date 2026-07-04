const express = require('express');
const authController = require('../controller/auth.controller');

const router = express.Router();

// The register route you already have
router.post('/register', authController.registerUser);

// ADD THIS LINE: The new login route
router.post('/login', authController.loginUser);

module.exports = router;