const mongoose = require('mongoose');

const quizResultSchema = new mongoose.Schema({
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true,
  },
  quizId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Quiz',
  },
  subject: {
    type: String,
    required: true,
  },
  topic: {
    type: String,
    required: true,
  },
  difficulty: {
    type: String,
    default: 'Medium',
  },
  score: {
    type: Number,
    required: true,
  },
  total: {
    type: Number,
    required: true,
  },
  percentage: {
    type: Number,
    required: true,
  },
  timeTaken: {
    type: Number, // in seconds
    default: 0,
  },
  userAnswers: {
    type: [Number],
    default: [],
  },
  weakTopics: {
    type: [String],
    default: [],
  },
  strongTopics: {
    type: [String],
    default: [],
  },
  recommendedTopics: {
    type: [String],
    default: [],
  },
  aiAnalysis: {
    type: String,
    default: '',
  },
  completedAt: {
    type: Date,
    default: Date.now,
  },
});

module.exports = mongoose.model('QuizResult', quizResultSchema);
