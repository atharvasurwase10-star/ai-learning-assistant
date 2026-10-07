const mongoose = require('mongoose');

const weeklyHourSchema = new mongoose.Schema(
  {
    day: { type: String, required: true },
    hours: { type: Number, required: true },
  },
  { _id: false }
);

const subjectProgressSchema = new mongoose.Schema(
  {
    subject: { type: String, required: true },
    progress: { type: Number, default: 0 },
    completedTopics: { type: Number, default: 0 },
    totalTopics: { type: Number, default: 10 },
    score: { type: Number, default: 0 },
    color: { type: String, default: '#3B82F6' },
  },
  { _id: false }
);

const weakTopicSchema = new mongoose.Schema(
  {
    topic: { type: String, required: true },
    subject: { type: String, required: true },
    status: { type: String, default: 'Needs Practice' },
    score: { type: Number, default: 50 },
  },
  { _id: false }
);

const strongTopicSchema = new mongoose.Schema(
  {
    topic: { type: String, required: true },
    subject: { type: String, required: true },
    score: { type: Number, default: 90 },
  },
  { _id: false }
);

const recommendationSchema = new mongoose.Schema(
  {
    title: { type: String, required: true },
    subject: { type: String, default: 'General' },
    description: { type: String, default: '' },
    action: { type: String, default: 'Start →' },
    itemType: { type: String, default: 'concept' },
  },
  { _id: false }
);

const activitySchema = new mongoose.Schema(
  {
    title: { type: String, required: true },
    subject: { type: String, default: 'General' },
    time: { type: String, default: 'Recent' },
    activityType: { type: String, default: 'activity' },
  },
  { _id: false }
);

const progressSchema = new mongoose.Schema({
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true,
    unique: true,
  },
  studyHours: {
    type: Number,
    default: 18.5,
  },
  topicsCompleted: {
    type: Number,
    default: 24,
  },
  streak: {
    type: Number,
    default: 7,
  },
  averageQuizScore: {
    type: Number,
    default: 82,
  },
  weeklyStudyHours: [weeklyHourSchema],
  subjectProgress: [subjectProgressSchema],
  weakTopics: [weakTopicSchema],
  strongTopics: [strongTopicSchema],
  recommendations: [recommendationSchema],
  recentActivity: [activitySchema],
  updatedAt: {
    type: Date,
    default: Date.now,
  },
});

module.exports = mongoose.model('Progress', progressSchema);
