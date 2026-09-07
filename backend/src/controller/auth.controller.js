const userModel = require('../models/user.model');
const jwt = require('jsonwebtoken');
const bcrypt = require('bcryptjs');
const crypto = require('crypto');
const sendEmail = require('../utils/sendEmail');

const clientUrl = process.env.CLIENT_URL || 'http://localhost:5173';
const isProduction = process.env.NODE_ENV === 'production';
const cookieOptions = {
  httpOnly: true,
  secure: isProduction,
  sameSite: 'lax',
  maxAge: 24 * 60 * 60 * 1000,
};
const clearCookieOptions = {
  httpOnly: true,
  secure: isProduction,
  sameSite: 'lax',
};

function isValidPassword(password) {
  return typeof password === 'string' && password.length >= 8;
}

async function registerUser(req, res) {
  try {
    const { username, email, password } = req.body;

    if (!username || !email || !password) {
      return res.status(400).json({ message: 'Please fill all the fields' });
    }

    if (!isValidPassword(password)) {
      return res.status(400).json({ message: 'Password must be at least 8 characters long' });
    }

    const isUserExists = await userModel.findOne({
      $or: [{ username }, { email }],
    });

    if (isUserExists) {
      return res.status(409).json({ message: 'Username or email already exists' });
    }

    const verificationToken = crypto.randomBytes(20).toString('hex');
    const user = await userModel.create({
      username,
      email,
      password: await bcrypt.hash(password, 10),
      role: 'contributor',
      verificationToken,
    });

    const verifyUrl = `${clientUrl}/verify-email/${verificationToken}`;

    try {
      await sendEmail({
        email: user.email,
        subject: 'LateNightPrep - Verify Your Email',
        message: `Welcome to LateNightPrep!\n\nPlease verify your email by clicking the link below:\n\n${verifyUrl}`,
      });
    } catch (emailError) {
      await user.deleteOne();
      throw emailError;
    }

    return res.status(201).json({
      message: 'Registration successful! Please check your email to verify your account.',
    });
  } catch (error) {
    console.error('Registration Error:', error);
    return res.status(500).json({ message: 'Internal server error' });
  }
}

async function loginUser(req, res) {
  try {
    const { username, email, password } = req.body;

    if (!password || (!username && !email)) {
      return res.status(400).json({
        message: 'Please provide a password and either an email or username',
      });
    }

    const searchCriteria = [];
    if (username) searchCriteria.push({ username });
    if (email) searchCriteria.push({ email });

    const user = await userModel.findOne({ $or: searchCriteria });
    if (!user) {
      return res.status(401).json({ message: 'Invalid credentials' });
    }

    if (!user.isVerified) {
      return res.status(401).json({ message: 'Please verify your email first. Check your inbox!' });
    }

    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
      return res.status(401).json({ message: 'Invalid credentials' });
    }

    const token = jwt.sign(
      { id: user._id },
      process.env.JWT_SECRET,
      { expiresIn: '1d' }
    );

    res.cookie('token', token, cookieOptions);
    return res.status(200).json({
      message: 'Login successful',
      user: {
        id: user._id,
        username: user.username,
        email: user.email,
        role: user.role,
      },
    });
  } catch (error) {
    console.error('Login Error:', error);
    return res.status(500).json({ message: 'Internal server error during login' });
  }
}

function logoutUser(req, res) {
  res.clearCookie('token', clearCookieOptions);
  return res.status(200).json({ message: 'Logged out successfully!' });
}

async function forgotPassword(req, res) {
  try {
    const { email } = req.body;
    if (!email) {
      return res.status(400).json({ message: 'Email is required' });
    }

    const user = await userModel.findOne({ email });
    if (!user) {
      return res.status(200).json({
        message: 'If an account exists for this email, a reset link has been sent.',
      });
    }

    const resetToken = crypto.randomBytes(20).toString('hex');
    user.resetPasswordToken = crypto
      .createHash('sha256')
      .update(resetToken)
      .digest('hex');
    user.resetPasswordExpire = Date.now() + 15 * 60 * 1000;
    await user.save();

    const resetUrl = `${clientUrl}/reset-password/${resetToken}`;
    await sendEmail({
      email: user.email,
      subject: 'LateNightPrep - Password Reset Link',
      message: `You requested a password reset.\n\nClick the link below to set a new password:\n\n${resetUrl}\n\nThis link is valid for only 15 minutes.`,
    });

    return res.status(200).json({ message: 'Password reset link sent to email!' });
  } catch (error) {
    console.error('Forgot password error:', error);
    return res.status(500).json({ message: 'Error sending email. Please try again.' });
  }
}

async function verifyEmail(req, res) {
  try {
    const user = await userModel.findOne({ verificationToken: req.params.token });

    if (!user) {
      return res.status(400).json({ message: 'Invalid verification token!' });
    }

    user.isVerified = true;
    user.verificationToken = undefined;
    await user.save();

    return res.status(200).json({ message: 'Email verified successfully! You can now login.' });
  } catch (error) {
    console.error('Email verification error:', error);
    return res.status(500).json({ message: 'Error verifying email.' });
  }
}

async function resetPassword(req, res) {
  try {
    const { password } = req.body;
    if (!isValidPassword(password)) {
      return res.status(400).json({ message: 'Password must be at least 8 characters long' });
    }

    const hashedResetToken = crypto
      .createHash('sha256')
      .update(req.params.token)
      .digest('hex');
    const user = await userModel.findOne({
      resetPasswordToken: hashedResetToken,
      resetPasswordExpire: { $gt: Date.now() },
    });

    if (!user) {
      return res.status(400).json({ message: 'Invalid or expired token!' });
    }

    user.password = await bcrypt.hash(password, 10);
    user.resetPasswordToken = undefined;
    user.resetPasswordExpire = undefined;
    await user.save();

    return res.status(200).json({
      message: 'Password reset successful! You can now login.',
    });
  } catch (error) {
    console.error('Password reset error:', error);
    return res.status(500).json({ message: 'Error resetting password.' });
  }
}

module.exports = {
  registerUser,
  loginUser,
  logoutUser,
  forgotPassword,
  resetPassword,
  verifyEmail,
};
