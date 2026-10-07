const Quiz = require('../models/Quiz');
const QuizResult = require('../models/QuizResult');
const Progress = require('../models/Progress');
const aiService = require('../services/aiService');

// @desc    Submit Quiz and get AI Performance Analysis
// @route   POST /api/quiz/submit
// @access  Private
const submitQuiz = async (req, res) => {
  try {
    const { quizId, subject, topic, answers = [], questions = [], timeTaken = 0 } = req.body;

    let quizQuestions = questions;

    // If quizId provided, fetch questions from DB if not in payload
    if (quizId && (!questions || questions.length === 0)) {
      const dbQuiz = await Quiz.findById(quizId);
      if (dbQuiz) {
        quizQuestions = dbQuiz.questions;
      }
    }

    if (!quizQuestions || quizQuestions.length === 0) {
      return res.status(400).json({ success: false, message: 'Questions are required to evaluate quiz' });
    }

    // Evaluate answers
    let score = 0;
    quizQuestions.forEach((q, idx) => {
      const userSelected = answers[idx];
      if (userSelected !== undefined && userSelected === q.correctAnswer) {
        score += 1;
      }
    });

    const total = quizQuestions.length;
    const percentage = Math.round((score / total) * 100);

    // AI Analysis
    const analysis = aiService.analyzePerformance({
      subject,
      topic,
      score,
      total,
      userAnswers: answers,
      questions: quizQuestions,
    });

    // Save Result
    const quizResult = await QuizResult.create({
      userId: req.user._id,
      quizId: quizId || null,
      subject: subject || 'General Engineering',
      topic: topic || 'Engineering Assessment',
      score,
      total,
      percentage,
      timeTaken,
      userAnswers: answers,
      weakTopics: analysis.weakTopics,
      strongTopics: analysis.strongTopics,
      recommendedTopics: analysis.recommendedTopics,
      aiAnalysis: analysis.feedback,
    });

    // Update Student Progress Analytics
    try {
      const studentProgress = await Progress.findOne({ userId: req.user._id });
      if (studentProgress) {
        // Recalculate average quiz score
        const allResults = await QuizResult.find({ userId: req.user._id }).select('percentage');
        const avgScore = Math.round(
          allResults.reduce((acc, curr) => acc + curr.percentage, 0) / (allResults.length || 1)
        );
        studentProgress.averageQuizScore = avgScore;
        studentProgress.topicsCompleted += 1;

        // Update weak and strong topics
        if (percentage < 70) {
          const exists = studentProgress.weakTopics.find((w) => w.topic === topic);
          if (!exists) {
            studentProgress.weakTopics.push({
              topic,
              subject,
              status: percentage < 50 ? 'Needs Practice' : 'Moderate',
              score: percentage,
            });
          }
        } else {
          // Remove from weak if passed with high score
          studentProgress.weakTopics = studentProgress.weakTopics.filter((w) => w.topic !== topic);
          const strongExists = studentProgress.strongTopics.find((s) => s.topic === topic);
          if (!strongExists) {
            studentProgress.strongTopics.push({ topic, subject, score: percentage });
          }
        }

        // Add recent activity
        studentProgress.recentActivity.unshift({
          title: `Completed ${topic} Quiz (${score}/${total} - ${percentage}%)`,
          subject,
          time: 'Just now',
          type: 'quiz',
        });
        if (studentProgress.recentActivity.length > 10) {
          studentProgress.recentActivity = studentProgress.recentActivity.slice(0, 10);
        }

        await studentProgress.save();
      }
    } catch (e) {
      console.warn('[Quiz Progress Update Warning]:', e.message);
    }

    return res.json({
      success: true,
      resultId: quizResult._id,
      score,
      total,
      percentage,
      timeTaken,
      feedback: analysis.feedback,
      weakTopics: analysis.weakTopics,
      strongTopics: analysis.strongTopics,
      recommendedTopics: analysis.recommendedTopics,
    });
  } catch (error) {
    console.error('[Quiz Submit Error]:', error);
    return res.status(500).json({ success: false, message: 'Error submitting quiz', error: error.message });
  }
};

// @desc    Get user's past quiz history
// @route   GET /api/quiz/history
// @access  Private
const getQuizHistory = async (req, res) => {
  try {
    const history = await QuizResult.find({ userId: req.user._id }).sort({ completedAt: -1 }).limit(25);
    return res.json({ success: true, history });
  } catch (error) {
    return res.status(500).json({ success: false, message: error.message });
  }
};

module.exports = {
  submitQuiz,
  getQuizHistory,
};
