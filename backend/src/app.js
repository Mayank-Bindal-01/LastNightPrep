const express = require('express');
const cookieParser = require('cookie-parser');
const cors = require('cors');
const multer = require('multer');


const authRoutes = require('./routes/auth.route');
const fileRoutes = require('./routes/file.route'); 

const app = express();
const clientUrl = process.env.CLIENT_URL || 'http://localhost:5173';

app.use(cors({
  origin: clientUrl,
  credentials: true 
}));

app.use(express.json());
app.use(cookieParser());

app.use('/api/auth', authRoutes);
app.use('/api/files', fileRoutes);

app.use((error, req, res, next) => {
  if (error instanceof multer.MulterError) {
    return res.status(400).json({ message: error.message });
  }

  if (error.message === 'Invalid file type! Only PDF files are allowed.') {
    return res.status(400).json({ message: error.message });
  }

  console.error('Unhandled request error:', error);
  return res.status(500).json({ message: 'Internal server error' });
});

module.exports = app;
