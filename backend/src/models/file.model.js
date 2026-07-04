const mongoose = require('mongoose');

const fileSchema = new mongoose.Schema({
  title: {
    type: String,
    required: true,
  },
  subject: {
    type: String,
    required: true,
  },
  fileUrl: {
    type: String,
    required: true, // Yeh actual PDF ka link hoga
  },
  uploadedBy: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User', // Yeh batayega ki kis contributor/admin ne upload kiya
    required: true
  }
}, { timestamps: true });

module.exports = mongoose.model('File', fileSchema);