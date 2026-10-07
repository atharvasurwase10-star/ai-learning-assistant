const express = require('express');
const router = express.Router();
const {
  getStudyPlan,
  createStudyPlan,
  updateTask,
  addTask,
  deleteTask,
} = require('../controllers/studyPlanController');
const { protect } = require('../middleware/auth');

router.use(protect);

router.get('/', getStudyPlan);
router.post('/', createStudyPlan);
router.put('/tasks/:taskId', updateTask);
router.post('/tasks', addTask);
router.delete('/tasks/:taskId', deleteTask);

module.exports = router;
