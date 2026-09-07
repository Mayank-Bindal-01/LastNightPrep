const jwt = require('jsonwebtoken');
const userModel = require('../models/user.model');

// Yeh naya guard check karega ki user logged in hai ya nahi
const isLoggedIn = async (req, res, next) => {
  try {
    const token = req.cookies.token;
    if (!token) {
      return res.status(401).json({ message: 'Please login to upload files.' });
    }

    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    const user = await userModel.findById(decoded.id);

    if (!user) {
      return res.status(401).json({ message: 'User not found.' });
    }

    req.user = user; // User ka data aage bhej do
    next();
  } catch (error) {
    res.status(401).json({ message: 'Invalid token' });
  }
};


// Yeh guard check karega ki user Admin hai ya nahi
const isAdmin = (req, res, next) => {
  if (!req.user) {
    return res.status(401).json({ message: 'Please login first.' });
  }

  if (req.user.role !== 'admin') {
    return res.status(403).json({ message: 'Access Denied! Only admins can delete files.' });
  }

  return next();
};

module.exports = { isAdmin, isLoggedIn };
