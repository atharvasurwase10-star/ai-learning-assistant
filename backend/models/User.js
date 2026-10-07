const mongoose = require('mongoose');

const userSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
    trim: true,
  },
  email: {
    type: String,
    required: true,
    unique: true,
    lowercase: true,
    trim: true,
  },
  password: {
    type: String,
    required: true,
  },
  college: {
    type: String,
    default: 'MIT Academy of Engineering',
  },
  branch: {
    type: String,
    default: 'Artificial Intelligence & Machine Learning',
  },
  year: {
    type: String,
    default: '2nd Year',
  },
  interests: {
    type: [String],
    default: ['Machine Learning', 'Data Structures', 'Python', 'Algorithms'],
  },
  learningLevel: {
    type: String,
    enum: ['Beginner', 'Intermediate', 'Advanced', 'Exam Preparation'],
    default: 'Intermediate',
  },
  avatar: {
    type: String,
    default: '',
  },
  createdAt: {
    type: Date,
    default: Date.now,
  },
});

module.exports = mongoose.model('User', userSchema);
