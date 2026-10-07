const mongoose = require('mongoose');

const taskSchema = new mongoose.Schema({
  id: { type: String, required: true },
  day: { type: String, required: true },
  time: { type: String, required: true },
  subject: { type: String, required: true },
  topic: { type: String, required: true },
  duration: { type: String, default: '45 mins' },
  completed: { type: Boolean, default: false },
  priority: { type: String, enum: ['High', 'Medium', 'Low'], default: 'Medium' },
  notes: { type: String, default: '' },
});

const studyPlanSchema = new mongoose.Schema({
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true,
  },
  title: {
    type: String,
    default: 'Personalized Engineering Study Plan',
  },
  examDate: {
    type: Date,
  },
  availableHours: {
    type: Number,
    default: 4,
  },
  preferredTime: {
    type: String,
    default: 'Evening (6 PM - 10 PM)',
  },
  difficulty: {
    type: String,
    default: 'Intermediate',
  },
  subjects: {
    type: [String],
    default: [],
  },
  tasks: {
    type: [taskSchema],
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

module.exports = mongoose.model('StudyPlan', studyPlanSchema);
