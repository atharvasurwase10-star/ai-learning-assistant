const mongoose = require('mongoose');

const subjectSchema = new mongoose.Schema({
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true,
  },
  name: {
    type: String,
    required: true,
    trim: true,
  },
  code: {
    type: String,
    default: '',
  },
  category: {
    type: String,
    default: 'Core Engineering',
  },
  progress: {
    type: Number,
    default: 0,
    min: 0,
    max: 100,
  },
  topics: {
    type: [String],
    default: [],
  },
  completedTopics: {
    type: [String],
    default: [],
  },
  quizScore: {
    type: Number,
    default: 0,
  },
  lastStudied: {
    type: Date,
    default: Date.now,
  },
  color: {
    type: String,
    default: 'from-blue-600 to-indigo-600',
  },
  icon: {
    type: String,
    default: 'book-open',
  },
  createdAt: {
    type: Date,
    default: Date.now,
  },
});

module.exports = mongoose.model('Subject', subjectSchema);
