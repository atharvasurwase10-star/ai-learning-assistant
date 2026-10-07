const express = require('express');
const router = express.Router();
const {
  getFlashcards,
  saveFlashcards,
  updateCardStatus,
  deleteFlashcards,
} = require('../controllers/flashcardsController');
const { protect } = require('../middleware/auth');

router.use(protect);

router.get('/', getFlashcards);
router.post('/', saveFlashcards);
router.put('/:setId/card/:cardId', updateCardStatus);
router.delete('/:id', deleteFlashcards);

module.exports = router;
