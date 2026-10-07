const mongoose = require('mongoose');

const noteSchema = new mongoose.Schema({
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true,
  },
  subject: {
    type: String,
    required: true,
  },
  topic: {
    type: String,
    required: true,
  },
  style: {
    type: String,
    enum: ['Simple', 'Detailed', 'Exam-oriented'],
    default: 'Exam-oriented',
  },
  difficulty: {
    type: String,
    default: 'Intermediate',
  },
  content: {
    definition: { type: String, default: '' },
    explanation: { type: String, default: '' },
    keyPoints: { type: [String], default: [] },
    examples: { type: [String], default: [] },
    advantages: { type: [String], default: [] },
    disadvantages: { type: [String], default: [] },
    applications: { type: [String], default: [] },
    examQuestions: { type: [String], default: [] },
  },
  rawMarkdown: {
    type: String,
    default: '',
  },
  createdAt: {
    type: Date,
    default: Date.now,
  },
  updatedAt: {
    type: Date,
    default: Date.now,
  },
});

module.exports = mongoose.model('Note', noteSchema);
