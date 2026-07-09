const userModel = require('../models/user.model');
const jwt = require('jsonwebtoken');
const bcrypt = require('bcryptjs');
const crypto = require('crypto');
const sendEmail = require('../utils/sendEmail');



async function registerUser(req, res) {
  try { 
    const { username, email, password } = req.body;

    if (!username || !email || !password) {
      return res.status(400).json({ message: 'Please fill all the fields' });
    }

    const isUserExists = await userModel.findOne({ 
      $or: [{ username }, { email }] 
    });

    if (isUserExists) {
      return res.status(409).json({ message: 'Username or email already exists' });
    }
    
    const hash = await bcrypt.hash(password, 10);

    // 1. Ek random verification token generate karein
    const verificationToken = crypto.randomBytes(20).toString('hex');

    // 2. Naya user create karein aur token database mein save karein
    const user = await userModel.create({ 
      username, 
      email, 
      password: hash, 
      role: 'contributor', // Safely hardcoded here
      verificationToken: verificationToken // Nayi field
    });

    // 3. Email ka link banayein aur user ko send karein
    const verifyUrl = `http://localhost:3000/api/auth/verify-email/${verificationToken}`;
    const message = `Welcome to LateNightPrep!\n\nPlease verify your email by clicking the link below:\n\n${verifyUrl}`;

    await sendEmail({
      email: user.email,
      subject: 'LateNightPrep - Verify Your Email',
      message: message
    });

    // 4. Success response bhejein (Bina token/cookie ke, kyunki verify karna zaroori hai)
    res.status(201).json({ 
      message: 'Registration successful! Please check your email to verify your account.' 
    });

  } catch (error) {
    console.error('Registration Error:', error);
    res.status(500).json({ message: 'Internal server error' });
  }
}

async function loginUser(req, res) {
  try {
    const { username, email, password } = req.body;

    // Check if the user forgot to type their password, or left both email/username blank
    if (!password || (!username && !email)) {
      return res.status(400).json({ message: 'Please provide a password and either an email or username' });
    }

    // 2. Build the search query safely so we don't search for "undefined"
    const searchCriteria = [];
    if (username) searchCriteria.push({ username });
    if (email) searchCriteria.push({ email });

    // 3. Find the user
    const user = await userModel.findOne({ email });
    if (!user) {
      return res.status(400).json({ message: 'Invalid credentials' });
    }

    // YEH NAYI LINE ADD KAREIN: Check if email is verified
    if (!user.isVerified) {
      return res.status(401).json({ message: 'Please verify your email first. Check your inbox!' });
    }

    const isMatch = await bcrypt.compare(password, user.password);

    if (!isMatch) {
      return res.status(401).json({ message: 'Invalid credentials' });
    }

   
    const token = jwt.sign({ id: user._id }, process.env.JWT_SECRET);

    res.cookie('token', token, {
      httpOnly: true,
      secure: true,
    });

    res.status(200).json({
      message: 'Login successful',
      user: {
        id: user._id,
        username: user.username,
        email: user.email,
        role: user.role
      }
    });

  } catch (error) {
    console.error('Login Error:', error);
    res.status(500).json({ message: 'Internal server error during login' });
  }
}


// Logout Controller
const logoutUser = (req, res) => {
  // 'token' naam ki cookie ko clear kar do
  res.clearCookie('token', {
    httpOnly: true,
    secure: process.env.NODE_ENV === 'production',
    sameSite: 'strict'
  });

  res.status(200).json({ message: 'Logged out successfully!' });
};

// 1. FORGOT PASSWORD CONTROLLER
const forgotPassword = async (req, res) => {
  try {
    // A. Find the user by their email
    const user = await userModel.findOne({ email: req.body.email });

    if (!user) {
      return res.status(404).json({
        message: 'User not found with this email'
      });
    }

    // B. Generate a random key (token)
    const resetToken = crypto.randomBytes(20).toString('hex');

    // C. Save the token and its expiry time (15 minutes) in the database
    user.resetPasswordToken = resetToken;
    user.resetPasswordExpire = Date.now() + 15 * 60 * 1000;
    // 15 minutes from the current time

    await user.save();

    // D. Prepare the email reset link and message
    // When the frontend is built, the Reset Password page
    // will be available at localhost:3000
    const resetUrl =
      `http://localhost:3000/reset-password/${resetToken}`;

    const message =
      `You requested a password reset.\n\n` +
      `Click the link below to set a new password:\n\n` +
      `${resetUrl}\n\n` +
      `This link is valid for only 15 minutes.`;

    // E. Send the email
    await sendEmail({
      email: user.email,
      subject: 'LateNightPrep - Password Reset Link',
      message: message
    });

    res.status(200).json({
      message: 'Password reset link sent to email!'
    });

  } catch (error) {
    console.error(error);

    res.status(500).json({
      message: 'Error sending email. Please try again.'
    });
  }
};


// EMAIL VERIFICATION CONTROLLER
const verifyEmail = async (req, res) => {
  try {
    const token = req.params.token;

    // Database mein us user ko dhundo jiske paas yeh token hai
    const user = await userModel.findOne({ verificationToken: token });

    if (!user) {
      return res.status(400).json({ message: 'Invalid verification token!' });
    }

    // Agar user mil gaya, toh usko verify kar do aur token hata do
    user.isVerified = true;
    user.verificationToken = undefined;
    await user.save();

    res.status(200).json({ message: 'Email verified successfully! You can now login.' });

  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Error verifying email.' });
  }
};


// 2. RESET PASSWORD CONTROLLER
const resetPassword = async (req, res) => {
  try {
    // A. Get the key (token) from the URL
    const resetToken = req.params.token;

    // B. Check whether this token is valid in the database
    // and whether it has not expired yet
    // ($gt means "greater than" the current time)
    const user = await userModel.findOne({
      resetPasswordToken: resetToken,
      resetPasswordExpire: { $gt: Date.now() }
    });

    if (!user) {
      return res.status(400).json({
        message: 'Invalid or expired token!'
      });
    }

    // C. If the token is valid, hash the new password
    const salt = await bcrypt.genSalt(10);

    user.password = await bcrypt.hash(
      req.body.password,
      salt
    );

    // D. Remove the old token details from the database
    user.resetPasswordToken = undefined;
    user.resetPasswordExpire = undefined;

    await user.save();

    res.status(200).json({
      message: 'Password reset successful! You can now login.'
    });

  } catch (error) {
    console.error(error);

    res.status(500).json({
      message: 'Error resetting password.'
    });
  }
};

module.exports = { registerUser, loginUser, logoutUser, forgotPassword, resetPassword, verifyEmail };