const express = require('express');
const router = express.Router();
const {
  chat,
  getConversations,
  getConversation,
  generateNotes,
  generateQuiz,
  generateStudyPlan,
  generateFlashcards,
  summarizeText,
  getAIStatus,
} = require('../controllers/aiController');
const { protect } = require('../middleware/auth');

router.get('/config', getAIStatus);
router.post('/chat', protect, chat);
router.get('/conversations', protect, getConversations);
router.get('/conversations/:id', protect, getConversation);
router.post('/notes', protect, generateNotes);
router.post('/quiz', protect, generateQuiz);
router.post('/study-plan', protect, generateStudyPlan);
router.post('/flashcards', protect, generateFlashcards);
router.post('/summarize', protect, summarizeText);

module.exports = router;
