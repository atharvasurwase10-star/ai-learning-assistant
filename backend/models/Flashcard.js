const mongoose = require('mongoose');

const cardItemSchema = new mongoose.Schema({
  id: { type: String, required: true },
  front: { type: String, required: true },
  back: { type: String, required: true },
  category: { type: String, default: 'Concept' },
  status: {
    type: String,
    enum: ['unreviewed', 'known', 'revise_later'],
    default: 'unreviewed',
  },
});

const flashcardSchema = new mongoose.Schema({
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true,
  },
  subject: {
    type: String,
    default: 'General Engineering',
  },
  topic: {
    type: String,
    required: true,
  },
  cards: {
    type: [cardItemSchema],
    default: [],
  },
  createdAt: {
    type: Date,
    default: Date.now,
  },
});

module.exports = mongoose.model('Flashcard', flashcardSchema);
