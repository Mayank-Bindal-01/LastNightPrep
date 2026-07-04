const express = require('express');
const router = express.Router();

const { registerUser, loginUser, logoutUser } = require('../controller/auth.controller');

router.post('/register', registerUser);
router.post('/login', loginUser);

// Naya Logout Route (GET request kyunki hum bas cookie clear kar rahe hain, koi data bhej nahi rahe)
router.get('/logout', logoutUser);

module.exports = router;