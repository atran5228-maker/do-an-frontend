const express = require('express');
const router = express.Router();
const verifyToken = require('../middleware/authMiddleware');
const {
  getWallets,
  createWallet,
  updateWallet,
  deleteWallet,
  transferMoney,
} = require('../controllers/walletController');

router.get('/', verifyToken, getWallets);
router.post('/', verifyToken, createWallet);
router.put('/:id', verifyToken, updateWallet);
router.delete('/:id', verifyToken, deleteWallet);
router.post('/transfer', verifyToken, transferMoney); // route riêng cho chuyển tiền

module.exports = router;