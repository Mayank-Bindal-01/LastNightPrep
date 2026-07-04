const express = require('express');
const cookieParser = require('cookie-parser');
const cors = require('cors');


const authRoutes = require('./routes/auth.route');
const fileRoutes = require('./routes/file.route'); 

const app = express();

app.use(cors({
  origin: 'http://localhost:3000',
  credentials: true 
}));

app.use(express.json());
app.use(cookieParser());

app.use('/api/auth', authRoutes);
app.use('/api/files', fileRoutes);

module.exports = app;