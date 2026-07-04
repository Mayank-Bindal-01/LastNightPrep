const multer = require('multer');

// Abhi ke liye file ko server ki memory mein temporary hold karenge
const storage = multer.memoryStorage();

// Multer ko configure karna
const upload = multer({
  storage: storage,
  limits: {
    // 300 KB limit (1 KB = 1024 Bytes)
    fileSize: 300 * 1024 
  },
  fileFilter: (req, file, cb) => {
    // Check karna ki upload hone wali file PDF hi hai na
    if (file.mimetype === 'application/pdf') {
      cb(null, true); // File pass ho gayi!
    } else {
      cb(new Error('Invalid file type! Only PDF files are allowed.'), false); // File fail ho gayi!
    }
  }
});

module.exports = upload;