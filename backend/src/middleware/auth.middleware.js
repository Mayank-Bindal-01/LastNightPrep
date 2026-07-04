const jwt = require('jsonwebtoken');
const userModel = require('../models/user.model');

// Yeh guard check karega ki user Admin hai ya nahi
const isAdmin = async (req, res, next) => {
  try {

    const token = req.cookies.token;

    if (!token) {
      return res.status(401).json({ message: 'No token provided. Please login.' });
    }

    // 2. Token verification (check karo ki fake toh nahi)
    const decoded = jwt.verify(token, process.env.JWT_SECRET);

    // 3. Database se user ko dhundo
    const user = await userModel.findById(decoded.id);

    // 4. MAIN STEP: Check karo kya user admin hai?
    if (user.role !== 'admin') {
      return res.status(403).json({ message: 'Access Denied! Only admins can delete files.' });
    }

    // 5. Sab sahi hai, toh agle function (controller) par jane do
    req.user = user; 
    next();

  } catch (error) {
    res.status(401).json({ message: 'Invalid token' });
  }
};

module.exports = { isAdmin };