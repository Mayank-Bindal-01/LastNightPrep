const mongoose = require('mongoose');


const userSchema = new mongoose.Schema({
  username: {
    type: String,
    required: true,
    unique: true,
  },
  email: {
    type: String,
    required: true,
    unique: true,
  },
  password: {
    type: String,
    required: true,
  },
  role: {
    type: String,
    enum: ['contributor', 'admin'], 
    default: 'contributor',
  },

  // EMAIL VERIFICATION FIELDS 
  isVerified: { type: Boolean, default: false }, // By default false rahega
  verificationToken: { type: String },

  resetPasswordToken: { type: String }, // Temporary chaabi save karne ke liye
  resetPasswordExpire: { type: Date }   // Chaabi kab expire hogi uska time

}, { timestamps: true });

const User = mongoose.model('User', userSchema);

module.exports = User;
