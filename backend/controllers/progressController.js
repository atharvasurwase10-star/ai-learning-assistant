const Progress = require('../models/Progress');
const Subject = require('../models/Subject');

// @desc    Get complete student learning progress and analytics
// @route   GET /api/progress
// @access  Private
const getProgress = async (req, res) => {
  try {
    let progress = await Progress.findOne({ userId: req.user._id });

    // If not found, create a baseline
    if (!progress) {
      progress = await Progress.create({
        userId: req.user._id,
        studyHours: 18.5,
        topicsCompleted: 24,
        streak: 7,
        averageQuizScore: 82,
        weeklyStudyHours: [
          { day: 'Mon', hours: 2.5 },
          { day: 'Tue', hours: 3.0 },
          { day: 'Wed', hours: 2.0 },
          { day: 'Thu', hours: 3.5 },
          { day: 'Fri', hours: 2.5 },
          { day: 'Sat', hours: 4.0 },
          { day: 'Sun', hours: 1.0 },
        ],
        subjectProgress: [
          { subject: 'Machine Learning', progress: 65, completedTopics: 6, totalTopics: 10, score: 84, color: '#3B82F6' },
          { subject: 'Data Structures', progress: 40, completedTopics: 4, totalTopics: 10, score: 78, color: '#8B5CF6' },
          { subject: 'Python Programming', progress: 85, completedTopics: 9, totalTopics: 11, score: 92, color: '#F59E0B' },
          { subject: 'Database Systems', progress: 55, completedTopics: 5, totalTopics: 9, score: 75, color: '#10B981' },
          { subject: 'Discrete Mathematics', progress: 70, completedTopics: 7, totalTopics: 10, score: 88, color: '#06B6D4' },
        ],
        weakTopics: [
          { topic: 'Recursion & Backtracking', subject: 'Data Structures', status: 'Needs Practice', score: 58 },
          { topic: 'Decision Trees & Entropy', subject: 'Machine Learning', status: 'Moderate', score: 68 },
          { topic: 'SQL Joins & Subqueries', subject: 'Database Systems', status: 'Needs Practice', score: 62 },
        ],
        strongTopics: [
          { topic: 'Python OOP & Lists', subject: 'Python Programming', score: 95 },
          { topic: 'Graph Theory & Paths', subject: 'Discrete Mathematics', score: 90 },
          { topic: 'Linear Regression Analysis', subject: 'Machine Learning', score: 88 },
        ],
        recommendations: [
          {
            title: 'Revise Decision Trees',
            subject: 'Machine Learning',
            description: 'Focus on Information Gain and Shannon Entropy mathematical formulas.',
            action: 'Start Notes →',
            type: 'notes',
          },
          {
            title: 'Practice Binary Tree Questions',
            subject: 'Data Structures',
            description: 'Solve Inorder, Preorder, and Postorder recursion questions.',
            action: 'Take Quiz →',
            type: 'quiz',
          },
          {
            title: 'Take a Machine Learning Quiz',
            subject: 'Machine Learning',
            description: 'Test your understanding of classification algorithms and evaluation metrics.',
            action: 'Start Quiz →',
            type: 'quiz',
          },
          {
            title: 'Review Python Recursion',
            subject: 'Python Programming',
            description: 'Strengthen base condition handling and avoid recursion depth errors.',
            action: 'Open Flashcards →',
            type: 'flashcards',
          },
        ],
        recentActivity: [
          { title: 'Completed Decision Trees MCQ Quiz (Score: 80%)', subject: 'Machine Learning', time: '2 hours ago', type: 'quiz' },
          { title: 'Generated Exam Notes for Supervised Learning', subject: 'Machine Learning', time: 'Yesterday', type: 'notes' },
          { title: 'Solved 5 Binary Tree Traversal Problems', subject: 'Data Structures', time: '2 days ago', type: 'practice' },
        ],
      });
    }

    return res.json({ success: true, progress });
  } catch (error) {
    return res.status(500).json({ success: false, message: error.message });
  }
};

// @desc    Update progress metrics
// @route   PUT /api/progress
// @access  Private
const updateProgress = async (req, res) => {
  try {
    const { studyHours, topicsCompleted, streak } = req.body;

    let progress = await Progress.findOne({ userId: req.user._id });
    if (!progress) {
      progress = new Progress({ userId: req.user._id });
    }

    if (studyHours !== undefined) progress.studyHours = studyHours;
    if (topicsCompleted !== undefined) progress.topicsCompleted = topicsCompleted;
    if (streak !== undefined) progress.streak = streak;

    progress.updatedAt = new Date();
    await progress.save();

    return res.json({ success: true, progress });
  } catch (error) {
    return res.status(500).json({ success: false, message: error.message });
  }
};

module.exports = {
  getProgress,
  updateProgress,
};
