const StudyPlan = require('../models/StudyPlan');
const { generateStudyPlan } = require('../services/aiService');

// @desc    Get current user's study plan
// @route   GET /api/study-plan
// @access  Private
const getStudyPlan = async (req, res) => {
  try {
    let plan = await StudyPlan.findOne({ userId: req.user._id });

    if (!plan) {
      // Auto-generate initial plan
      const generated = await generateStudyPlan({
        examDate: new Date(Date.now() + 14 * 24 * 60 * 60 * 1000),
        subjects: ['Machine Learning', 'Data Structures', 'Python'],
      });
      plan = await StudyPlan.create({
        userId: req.user._id,
        ...generated,
      });
    }

    return res.json({ success: true, studyPlan: plan });
  } catch (error) {
    return res.status(500).json({ success: false, message: error.message });
  }
};

// @desc    Create or update full study plan
// @route   POST /api/study-plan
// @access  Private
const createStudyPlan = async (req, res) => {
  try {
    const { title, examDate, availableHours, preferredTime, difficulty, tasks, subjects } = req.body;

    let plan = await StudyPlan.findOne({ userId: req.user._id });

    if (plan) {
      if (title) plan.title = title;
      if (examDate) plan.examDate = examDate;
      if (availableHours) plan.availableHours = availableHours;
      if (preferredTime) plan.preferredTime = preferredTime;
      if (difficulty) plan.difficulty = difficulty;
      if (tasks) plan.tasks = tasks;
      if (subjects) plan.subjects = subjects;
      plan.updatedAt = new Date();
      await plan.save();
    } else {
      plan = await StudyPlan.create({
        userId: req.user._id,
        title: title || 'Engineering Exam Preparation Plan',
        examDate: examDate || new Date(Date.now() + 14 * 24 * 60 * 60 * 1000),
        availableHours: availableHours || 4,
        preferredTime: preferredTime || 'Evening (6 PM - 10 PM)',
        difficulty: difficulty || 'Intermediate',
        tasks: tasks || [],
        subjects: subjects || [],
      });
    }

    return res.json({ success: true, studyPlan: plan });
  } catch (error) {
    return res.status(500).json({ success: false, message: error.message });
  }
};

// @desc    Update specific task status (toggle complete / edit)
// @route   PUT /api/study-plan/tasks/:taskId
// @access  Private
const updateTask = async (req, res) => {
  try {
    const { taskId } = req.params;
    const { completed, topic, subject, time, day, notes } = req.body;

    const plan = await StudyPlan.findOne({ userId: req.user._id });
    if (!plan) {
      return res.status(404).json({ success: false, message: 'Study plan not found' });
    }

    const task = plan.tasks.find((t) => t.id === taskId || t._id?.toString() === taskId);
    if (!task) {
      return res.status(404).json({ success: false, message: 'Task not found in plan' });
    }

    if (completed !== undefined) task.completed = completed;
    if (topic) task.topic = topic;
    if (subject) task.subject = subject;
    if (time) task.time = time;
    if (day) task.day = day;
    if (notes !== undefined) task.notes = notes;

    plan.updatedAt = new Date();
    await plan.save();

    return res.json({ success: true, studyPlan: plan, updatedTask: task });
  } catch (error) {
    return res.status(500).json({ success: false, message: error.message });
  }
};

// @desc    Add a custom task to plan
// @route   POST /api/study-plan/tasks
// @access  Private
const addTask = async (req, res) => {
  try {
    const { day, time, subject, topic, duration, priority, notes } = req.body;

    if (!day || !subject || !topic) {
      return res.status(400).json({ success: false, message: 'Day, subject, and topic are required' });
    }

    const plan = await StudyPlan.findOne({ userId: req.user._id });
    if (!plan) {
      return res.status(404).json({ success: false, message: 'Study plan not found' });
    }

    const newTask = {
      id: `task-${Date.now()}`,
      day,
      time: time || '07:00 PM - 08:00 PM',
      subject,
      topic,
      duration: duration || '60 mins',
      priority: priority || 'Medium',
      completed: false,
      notes: notes || '',
    };

    plan.tasks.push(newTask);
    plan.updatedAt = new Date();
    await plan.save();

    return res.status(201).json({ success: true, studyPlan: plan, newTask });
  } catch (error) {
    return res.status(500).json({ success: false, message: error.message });
  }
};

// @desc    Delete task from plan
// @route   DELETE /api/study-plan/tasks/:taskId
// @access  Private
const deleteTask = async (req, res) => {
  try {
    const { taskId } = req.params;
    const plan = await StudyPlan.findOne({ userId: req.user._id });
    if (!plan) {
      return res.status(404).json({ success: false, message: 'Study plan not found' });
    }

    plan.tasks = plan.tasks.filter((t) => t.id !== taskId && t._id?.toString() !== taskId);
    plan.updatedAt = new Date();
    await plan.save();

    return res.json({ success: true, studyPlan: plan });
  } catch (error) {
    return res.status(500).json({ success: false, message: error.message });
  }
};

module.exports = {
  getStudyPlan,
  createStudyPlan,
  updateTask,
  addTask,
  deleteTask,
};
