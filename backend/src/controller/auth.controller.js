const userModel = require('../models/user.model');
const jwt = require('jsonwebtoken');
const bcrypt = require('bcryptjs');

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

    const user = await userModel.create({ 
      username, 
      email, 
      password: hash, 
      role: 'contributor' // Safely hardcoded here
    });

    const token = jwt.sign({ id: user._id }, process.env.JWT_SECRET);

    res.cookie('token', token, {
        httpOnly: true, // Prevents frontend hackers from stealing the cookie
        secure: true, // Ensures the cookie is sent over HTTPS
    });

    res.status(201).json({ 
      message: 'User registered successfully',
      user : { 
        id: user._id, 
        username: user.username, 
        email: user.email, 
        role: user.role 
      } 
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
    const user = await userModel.findOne({
      $or: searchCriteria
    });

    if (!user) {
      return res.status(404).json({ message: 'User not found' });
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

module.exports = { registerUser, loginUser, logoutUser };