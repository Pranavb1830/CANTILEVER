const mongoose = require('mongoose');

const userSchema = new mongoose.Schema({
  username: {
    type: String,
    required: true,
    unique: true,
    trim: true
  },
  password: {
    type: String,
    required: true,
    minlength: 6
  },
  email: {
    type: String,
    required: true,
    unique: true,
    trim: true,
    lowercase: true
  },
  profilePhoto: {
    type: String,
    default: 'https://example.com/default-profile-photo.png'
  }
}, { timestamps: true });

module.exports = mongoose.model('User', userSchema);