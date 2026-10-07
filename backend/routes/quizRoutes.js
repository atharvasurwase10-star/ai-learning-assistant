const express = require('express');
const router = express.Router();
const { submitQuiz, getQuizHistory } = require('../controllers/quizController');
const { protect } = require('../middleware/auth');

router.use(protect);

router.post('/submit', submitQuiz);
router.get('/history', getQuizHistory);

module.exports = router;
