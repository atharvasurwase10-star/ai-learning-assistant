const mongoose = require('mongoose');

const messageSchema = new mongoose.Schema({
  sender: {
    type: String,
    enum: ['student', 'assistant'],
    required: true,
  },
  text: {
    type: String,
    required: true,
  },
  timestamp: {
    type: Date,
    default: Date.now,
  },
  learningLevel: {
    type: String,
    default: 'Intermediate',
  },
  intent: {
    type: String,
    default: 'general_query',
  },
  subject: {
    type: String,
    default: 'General',
  },
  recommendations: {
    type: [String],
    default: [],
  },
  statusMessage: {
    type: String,
    default: '',
  },
});

const chatHistorySchema = new mongoose.Schema({
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true,
  },
  conversationId: {
    type: String,
    required: true,
    index: true,
  },
  title: {
    type: String,
    default: 'New Conversation',
  },
  subject: {
    type: String,
    default: 'General Engineering',
  },
  messages: {
    type: [messageSchema],
    default: [],
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

module.exports = mongoose.model('ChatHistory', chatHistorySchema);
