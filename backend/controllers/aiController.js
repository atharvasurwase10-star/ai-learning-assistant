const ChatHistory = require('../models/ChatHistory');
const Progress = require('../models/Progress');
const Note = require('../models/Note');
const Quiz = require('../models/Quiz');
const Flashcard = require('../models/Flashcard');
const StudyPlan = require('../models/StudyPlan');
const aiService = require('../services/aiService');

// @desc    Process AI Chat message
// @route   POST /api/ai/chat
// @access  Private
const chat = async (req, res) => {
  try {
    const { message, conversationId, subject, learningLevel } = req.body;

    if (!message || message.trim() === '') {
      return res.status(400).json({ success: false, message: 'Message text is required' });
    }

    const currentLevel = learningLevel || req.user.learningLevel || 'Intermediate';
    const convId = conversationId || `conv-${Date.now()}`;

    // Invoke AI Agent
    const agentResult = await aiService.askAssistant({
      message,
      conversationId: convId,
      subject,
      learningLevel: currentLevel,
    });

    // Save or update ChatHistory
    let chatRecord = await ChatHistory.findOne({ userId: req.user._id, conversationId: convId });

    if (!chatRecord) {
      chatRecord = new ChatHistory({
        userId: req.user._id,
        conversationId: convId,
        title: message.slice(0, 32) + (message.length > 32 ? '...' : ''),
        subject: agentResult.subject,
        messages: [],
      });
    }

    chatRecord.messages.push({
      sender: 'student',
      text: message,
      timestamp: new Date(),
      learningLevel: currentLevel,
      intent: agentResult.intent,
      subject: agentResult.subject,
    });

    chatRecord.messages.push({
      sender: 'assistant',
      text: agentResult.reply,
      timestamp: new Date(),
      learningLevel: currentLevel,
      intent: agentResult.intent,
      subject: agentResult.subject,
      recommendations: agentResult.recommendations,
      statusMessage: agentResult.statusMessages[agentResult.statusMessages.length - 1],
    });

    chatRecord.updatedAt = new Date();
    await chatRecord.save();

    // Update student recent activity in Progress
    try {
      await Progress.findOneAndUpdate(
        { userId: req.user._id },
        {
          $push: {
            recentActivity: {
              $each: [
                {
                  title: `Asked AI: "${message.slice(0, 35)}..."`,
                  subject: agentResult.subject,
                  time: 'Just now',
                  type: 'chat',
                },
              ],
              $position: 0,
              $slice: 10,
            },
          },
        }
      );
    } catch (e) {
      // Non-critical background update
    }

    return res.json({
      success: true,
      conversationId: convId,
      reply: agentResult.reply,
      intent: agentResult.intent,
      subject: agentResult.subject,
      topic: agentResult.topic,
      recommendations: agentResult.recommendations,
      statusMessages: agentResult.statusMessages,
      mode: agentResult.mode,
    });
  } catch (error) {
    console.error('[AI Chat Error]:', error);
    return res.status(500).json({
      success: false,
      message: 'Failed to process AI chat message',
      error: error.message,
    });
  }
};

// @desc    Get user's chat conversations
// @route   GET /api/ai/conversations
// @access  Private
const getConversations = async (req, res) => {
  try {
    const list = await ChatHistory.find({ userId: req.user._id })
      .select('conversationId title subject updatedAt createdAt')
      .sort({ updatedAt: -1 })
      .limit(20);

    return res.json({ success: true, conversations: list });
  } catch (error) {
    return res.status(500).json({ success: false, message: error.message });
  }
};

// @desc    Get specific chat history
// @route   GET /api/ai/conversations/:id
// @access  Private
const getConversation = async (req, res) => {
  try {
    const conv = await ChatHistory.findOne({
      userId: req.user._id,
      conversationId: req.params.id,
    });

    if (!conv) {
      return res.status(404).json({ success: false, message: 'Conversation not found' });
    }

    return res.json({ success: true, conversation: conv });
  } catch (error) {
    return res.status(500).json({ success: false, message: error.message });
  }
};

// @desc    Generate structured notes
// @route   POST /api/ai/notes
// @access  Private
const generateNotes = async (req, res) => {
  try {
    const { subject, topic, style, difficulty, saveToDb = true } = req.body;

    if (!topic || !subject) {
      return res.status(400).json({ success: false, message: 'Subject and topic are required' });
    }

    const result = await aiService.generateNotes({
      subject,
      topic,
      style: style || 'Exam-oriented',
      difficulty: difficulty || 'Intermediate',
    });

    let savedNote = null;
    if (saveToDb) {
      savedNote = await Note.create({
        userId: req.user._id,
        subject,
        topic,
        style: style || 'Exam-oriented',
        difficulty: difficulty || 'Intermediate',
        content: result.notes,
      });
    }

    return res.json({
      success: true,
      notes: result.notes,
      noteId: savedNote?._id,
      mode: result.mode,
    });
  } catch (error) {
    console.error('[AI Notes Error]:', error);
    return res.status(500).json({ success: false, message: 'Error generating notes', error: error.message });
  }
};

// @desc    Generate MCQ Quiz
// @route   POST /api/ai/quiz
// @access  Private
const generateQuiz = async (req, res) => {
  try {
    const { subject, topic, numQuestions = 5, difficulty = 'Medium' } = req.body;

    if (!topic || !subject) {
      return res.status(400).json({ success: false, message: 'Subject and topic are required' });
    }

    const result = await aiService.generateQuiz({
      subject,
      topic,
      numQuestions: Number(numQuestions) || 5,
      difficulty,
    });

    const quizDoc = await Quiz.create({
      userId: req.user._id,
      subject,
      topic,
      difficulty,
      questions: result.questions,
    });

    return res.json({
      success: true,
      quizId: quizDoc._id,
      questions: result.questions,
      subject,
      topic,
      difficulty,
      mode: result.mode,
    });
  } catch (error) {
    console.error('[AI Quiz Error]:', error);
    return res.status(500).json({ success: false, message: 'Error generating quiz', error: error.message });
  }
};

// @desc    Generate Study Plan
// @route   POST /api/ai/study-plan
// @access  Private
const generateStudyPlan = async (req, res) => {
  try {
    const { examDate, subjects, availableHours, preferredTime, difficulty } = req.body;

    const result = await aiService.generateStudyPlan({
      examDate,
      subjects: subjects || ['Machine Learning', 'Data Structures', 'Python'],
      availableHours: availableHours || 4,
      preferredTime,
      difficulty,
    });

    // Update or create user's plan
    let plan = await StudyPlan.findOne({ userId: req.user._id });
    if (plan) {
      plan.tasks = result.tasks;
      plan.examDate = result.examDate;
      plan.availableHours = result.availableHours;
      plan.preferredTime = result.preferredTime;
      plan.difficulty = result.difficulty;
      plan.updatedAt = new Date();
      await plan.save();
    } else {
      plan = await StudyPlan.create({
        userId: req.user._id,
        ...result,
      });
    }

    return res.json({
      success: true,
      studyPlan: plan,
      mode: result.mode,
    });
  } catch (error) {
    console.error('[AI Study Plan Error]:', error);
    return res.status(500).json({ success: false, message: 'Error generating study plan', error: error.message });
  }
};

// @desc    Generate Flashcards
// @route   POST /api/ai/flashcards
// @access  Private
const generateFlashcards = async (req, res) => {
  try {
    const { topic, subject } = req.body;

    if (!topic) {
      return res.status(400).json({ success: false, message: 'Topic is required' });
    }

    const result = await aiService.generateFlashcards({ topic, subject });

    const flashDoc = await Flashcard.create({
      userId: req.user._id,
      subject: subject || 'General Engineering',
      topic,
      cards: result.cards,
    });

    return res.json({
      success: true,
      flashcardSetId: flashDoc._id,
      cards: result.cards,
      topic,
      subject,
      mode: result.mode,
    });
  } catch (error) {
    console.error('[AI Flashcards Error]:', error);
    return res.status(500).json({ success: false, message: 'Error generating flashcards', error: error.message });
  }
};

// @desc    Summarize Text
// @route   POST /api/ai/summarize
// @access  Private
const summarizeText = async (req, res) => {
  try {
    const { text, lengthOption = 'Short' } = req.body;

    if (!text || text.trim() === '') {
      return res.status(400).json({ success: false, message: 'Text to summarize is required' });
    }

    const result = await aiService.summarizeText({ text, lengthOption });

    return res.json({
      success: true,
      summary: result.summary,
      lengthOption: result.lengthOption,
      mode: result.mode,
    });
  } catch (error) {
    console.error('[AI Summarize Error]:', error);
    return res.status(500).json({ success: false, message: 'Error summarizing text', error: error.message });
  }
};

// @desc    Get AI Provider & Mode Status
// @route   GET /api/ai/config
// @access  Public
const getAIStatus = async (req, res) => {
  const config = aiService.getAIConfig();
  return res.json({
    success: true,
    mode: config.isLive ? 'live' : 'demo',
    provider: config.provider,
    model: config.model,
    isLive: config.isLive,
    description: config.isLive
      ? `Connected to ${config.provider.toUpperCase()} (${config.model})`
      : 'Running in high-performance Demo AI Mode (ideal for college viva/demo without API keys)',
  });
};

module.exports = {
  chat,
  getConversations,
  getConversation,
  generateNotes,
  generateQuiz,
  generateStudyPlan,
  generateFlashcards,
  summarizeText,
  getAIStatus,
};
