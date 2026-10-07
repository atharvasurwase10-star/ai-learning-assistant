const Subject = require('../models/Subject');

// @desc    Get all subjects for the user
// @route   GET /api/subjects
// @access  Private
const getSubjects = async (req, res) => {
  try {
    const subjects = await Subject.find({ userId: req.user._id }).sort({ progress: -1 });
    return res.json({ success: true, subjects });
  } catch (error) {
    return res.status(500).json({ success: false, message: error.message });
  }
};

// @desc    Add a new subject
// @route   POST /api/subjects
// @access  Private
const addSubject = async (req, res) => {
  try {
    const { name, code, category, topics, color, icon } = req.body;

    if (!name) {
      return res.status(400).json({ success: false, message: 'Subject name is required' });
    }

    const newSubject = await Subject.create({
      userId: req.user._id,
      name,
      code: code || '',
      category: category || 'Core Engineering',
      topics: Array.isArray(topics) ? topics : (topics ? topics.split(',').map((t) => t.trim()) : []),
      color: color || 'from-indigo-600 to-purple-600',
      icon: icon || 'book-open',
    });

    return res.status(201).json({ success: true, subject: newSubject });
  } catch (error) {
    return res.status(500).json({ success: false, message: error.message });
  }
};

// @desc    Update a subject
// @route   PUT /api/subjects/:id
// @access  Private
const updateSubject = async (req, res) => {
  try {
    const subject = await Subject.findOne({ _id: req.params.id, userId: req.user._id });
    if (!subject) {
      return res.status(404).json({ success: false, message: 'Subject not found' });
    }

    const { name, code, progress, topics, completedTopics, quizScore } = req.body;
    if (name) subject.name = name;
    if (code !== undefined) subject.code = code;
    if (progress !== undefined) subject.progress = progress;
    if (topics) subject.topics = topics;
    if (completedTopics) subject.completedTopics = completedTopics;
    if (quizScore !== undefined) subject.quizScore = quizScore;
    subject.lastStudied = new Date();

    await subject.save();
    return res.json({ success: true, subject });
  } catch (error) {
    return res.status(500).json({ success: false, message: error.message });
  }
};

// @desc    Delete a subject
// @route   DELETE /api/subjects/:id
// @access  Private
const deleteSubject = async (req, res) => {
  try {
    const subject = await Subject.findOneAndDelete({ _id: req.params.id, userId: req.user._id });
    if (!subject) {
      return res.status(404).json({ success: false, message: 'Subject not found' });
    }
    return res.json({ success: true, message: 'Subject deleted successfully' });
  } catch (error) {
    return res.status(500).json({ success: false, message: error.message });
  }
};

module.exports = {
  getSubjects,
  addSubject,
  updateSubject,
  deleteSubject,
};
