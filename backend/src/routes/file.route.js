const express = require('express');
const router = express.Router();

const { uploadFile, deleteFile, getAllFiles } = require('../controller/file.controller');
const upload = require('../middleware/upload.middleware');
const { isLoggedIn, isAdmin } = require('../middleware/auth.middleware');

// 1. Get All Files Route (Koi bhi dekh sakta hai, isliye isme koi guard nahi lagaya)
router.get('/all', getAllFiles);

// 2. Upload Route
router.post('/upload', isLoggedIn, upload.single('file'), uploadFile);

// 3. Delete Route 
router.delete('/delete/:id', isLoggedIn, isAdmin, deleteFile);

module.exports = router;