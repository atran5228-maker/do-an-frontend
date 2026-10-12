const express = require('express');
const router = express.Router();
const verifyToken = require('../middleware/authMiddleware');
const {
  getBudgets,
  createBudget,
  updateBudget,
  deleteBudget,
} = require('../controllers/budgetController');

router.get('/', verifyToken, getBudgets);
router.post('/', verifyToken, createBudget);
router.put('/:id', verifyToken, updateBudget);
router.delete('/:id', verifyToken, deleteBudget);

module.exports = router;