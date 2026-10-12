const express = require('express');
const router = express.Router();
const verifyToken = require('../middleware/authMiddleware');
const requireAdmin = require('../middleware/requireAdmin');
const {
  getStats,
  getUsers,
  setStatus,
  resetPassword,
  removeUser,
} = require('../controllers/adminController');

router.get('/stats', verifyToken, requireAdmin, getStats);
router.get('/users', verifyToken, requireAdmin, getUsers);
router.patch('/users/:id/status', verifyToken, requireAdmin, setStatus);
router.patch('/users/:id/reset-password', verifyToken, requireAdmin, resetPassword);
router.delete('/users/:id', verifyToken, requireAdmin, removeUser);

module.exports = router;