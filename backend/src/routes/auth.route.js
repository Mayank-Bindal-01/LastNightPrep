const express = require('express');
const router = express.Router();

const { registerUser, loginUser, logoutUser, forgotPassword, resetPassword, verifyEmail } = require('../controller/auth.controller');

router.post('/register', registerUser);
router.post('/login', loginUser);
router.post('/forgot-password', forgotPassword);
router.post('/reset-password/:token', resetPassword);
router.get('/verify-email/:token', verifyEmail);

// Naya Logout Route (GET request kyunki hum bas cookie clear kar rahe hain, koi data bhej nahi rahe)
router.get('/logout', logoutUser);

module.exports = router;