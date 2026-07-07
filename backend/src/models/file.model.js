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
  
  applicableFor: [
    {
      branch: { type: String, required: true },
      semester: { type: Number, required: true }
    }
  ],

  fileType: {
    type: String,
    required: true,
    enum: ['notes', 'syllabus', 'question_paper', 'assignment'], 
    default: 'notes'
  },
  fileUrl: {
    type: String,
    required: true, 
  },
  uploadedBy: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User', 
    required: true
  }
}, { timestamps: true });

module.exports = mongoose.model('File', fileSchema);