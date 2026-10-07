const Note = require('../models/Note');

// @desc    Get all saved notes for the user
// @route   GET /api/notes
// @access  Private
const getNotes = async (req, res) => {
  try {
    const notes = await Note.find({ userId: req.user._id }).sort({ createdAt: -1 });
    return res.json({ success: true, notes });
  } catch (error) {
    return res.status(500).json({ success: false, message: error.message });
  }
};

// @desc    Get single note by ID
// @route   GET /api/notes/:id
// @access  Private
const getNoteById = async (req, res) => {
  try {
    const note = await Note.findOne({ _id: req.params.id, userId: req.user._id });
    if (!note) {
      return res.status(404).json({ success: false, message: 'Note not found' });
    }
    return res.json({ success: true, note });
  } catch (error) {
    return res.status(500).json({ success: false, message: error.message });
  }
};

// @desc    Save or create a note
// @route   POST /api/notes
// @access  Private
const saveNote = async (req, res) => {
  try {
    const { subject, topic, style, difficulty, content, rawMarkdown } = req.body;

    if (!subject || !topic) {
      return res.status(400).json({ success: false, message: 'Subject and topic are required' });
    }

    const note = await Note.create({
      userId: req.user._id,
      subject,
      topic,
      style: style || 'Exam-oriented',
      difficulty: difficulty || 'Intermediate',
      content: content || {},
      rawMarkdown: rawMarkdown || '',
    });

    return res.status(201).json({ success: true, note });
  } catch (error) {
    return res.status(500).json({ success: false, message: error.message });
  }
};

// @desc    Update a note
// @route   PUT /api/notes/:id
// @access  Private
const updateNote = async (req, res) => {
  try {
    const note = await Note.findOne({ _id: req.params.id, userId: req.user._id });
    if (!note) {
      return res.status(404).json({ success: false, message: 'Note not found' });
    }

    const { subject, topic, style, difficulty, content, rawMarkdown } = req.body;
    if (subject) note.subject = subject;
    if (topic) note.topic = topic;
    if (style) note.style = style;
    if (difficulty) note.difficulty = difficulty;
    if (content) note.content = content;
    if (rawMarkdown !== undefined) note.rawMarkdown = rawMarkdown;
    note.updatedAt = new Date();

    await note.save();
    return res.json({ success: true, note });
  } catch (error) {
    return res.status(500).json({ success: false, message: error.message });
  }
};

// @desc    Delete a note
// @route   DELETE /api/notes/:id
// @access  Private
const deleteNote = async (req, res) => {
  try {
    const note = await Note.findOneAndDelete({ _id: req.params.id, userId: req.user._id });
    if (!note) {
      return res.status(404).json({ success: false, message: 'Note not found' });
    }
    return res.json({ success: true, message: 'Note deleted successfully' });
  } catch (error) {
    return res.status(500).json({ success: false, message: error.message });
  }
};

module.exports = {
  getNotes,
  getNoteById,
  saveNote,
  updateNote,
  deleteNote,
};
