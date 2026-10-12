const express = require("express");
const router = express.Router();
const { login } = require("../controllers/authController");

router.post("/login", login);

// Trang admin chỉ có 1 tài khoản cố định — không cho đăng ký tự do
router.post("/register", (req, res) => {
  res.status(403).json({
    message: 'Trang admin không hỗ trợ đăng ký. Tài khoản admin được tạo tự động khi khởi động server.',
  });
});

module.exports = router;