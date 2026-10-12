const express = require('express');
const router = express.Router();
const verifyToken = require('../middleware/authMiddleware');
const {
  getSavingsGoals,
  createSavingsGoal,
  updateProgress,
  updateSavingsGoal,
  deleteSavingsGoal,
} = require('../controllers/SavingsGoalController');

router.get('/', verifyToken, getSavingsGoals);
router.post('/', verifyToken, createSavingsGoal);
router.put('/:id', verifyToken, updateSavingsGoal);
router.put('/:id/progress', verifyToken, updateProgress); // route riêng cho cập nhật tiến độ
router.delete('/:id', verifyToken, deleteSavingsGoal);

module.exports = router;