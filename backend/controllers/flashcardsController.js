const Flashcard = require('../models/Flashcard');

// @desc    Get all flashcard sets for user
// @route   GET /api/flashcards
// @access  Private
const getFlashcards = async (req, res) => {
  try {
    const flashcards = await Flashcard.find({ userId: req.user._id }).sort({ createdAt: -1 });
    return res.json({ success: true, flashcards });
  } catch (error) {
    return res.status(500).json({ success: false, message: error.message });
  }
};

// @desc    Save a flashcard deck
// @route   POST /api/flashcards
// @access  Private
const saveFlashcards = async (req, res) => {
  try {
    const { subject, topic, cards } = req.body;

    if (!topic || !cards || cards.length === 0) {
      return res.status(400).json({ success: false, message: 'Topic and cards are required' });
    }

    const deck = await Flashcard.create({
      userId: req.user._id,
      subject: subject || 'General Engineering',
      topic,
      cards,
    });

    return res.status(201).json({ success: true, flashcards: deck });
  } catch (error) {
    return res.status(500).json({ success: false, message: error.message });
  }
};

// @desc    Update single card status in a set (known / revise_later)
// @route   PUT /api/flashcards/:setId/card/:cardId
// @access  Private
const updateCardStatus = async (req, res) => {
  try {
    const { setId, cardId } = req.params;
    const { status } = req.body;

    const deck = await Flashcard.findOne({ _id: setId, userId: req.user._id });
    if (!deck) {
      return res.status(404).json({ success: false, message: 'Flashcard set not found' });
    }

    const card = deck.cards.find((c) => c.id === cardId || c._id?.toString() === cardId);
    if (!card) {
      return res.status(404).json({ success: false, message: 'Card not found in set' });
    }

    if (status) card.status = status;
    await deck.save();

    return res.json({ success: true, deck, updatedCard: card });
  } catch (error) {
    return res.status(500).json({ success: false, message: error.message });
  }
};

// @desc    Delete flashcard set
// @route   DELETE /api/flashcards/:id
// @access  Private
const deleteFlashcards = async (req, res) => {
  try {
    const deck = await Flashcard.findOneAndDelete({ _id: req.params.id, userId: req.user._id });
    if (!deck) {
      return res.status(404).json({ success: false, message: 'Flashcard set not found' });
    }
    return res.json({ success: true, message: 'Flashcard set deleted successfully' });
  } catch (error) {
    return res.status(500).json({ success: false, message: error.message });
  }
};

module.exports = {
  getFlashcards,
  saveFlashcards,
  updateCardStatus,
  deleteFlashcards,
};
