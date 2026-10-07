const express = require('express');
const router = express.Router();
const {
  getNotes,
  getNoteById,
  saveNote,
  updateNote,
  deleteNote,
} = require('../controllers/notesController');
const { protect } = require('../middleware/auth');

router.use(protect);

router.get('/', getNotes);
router.get('/:id', getNoteById);
router.post('/', saveNote);
router.put('/:id', updateNote);
router.delete('/:id', deleteNote);

module.exports = router;
