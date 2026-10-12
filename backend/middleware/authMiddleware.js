const jwt = require('jsonwebtoken');
const User = require('../models/User');

async function verifyToken(req, res, next) {
  const authHeader = req.headers.authorization;

  if (!authHeader || !authHeader.startsWith('Bearer ')) {
    return res.status(401).json({ message: 'Không có token, vui lòng đăng nhập' });
  }

  const token = authHeader.split(' ')[1];

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);

    // Kiểm tra trực tiếp trong DB, phòng trường hợp admin vừa khóa tài khoản này
    const user = await User.findByPk(decoded.id);
    if (!user) {
      return res.status(401).json({ message: 'Tài khoản không tồn tại' });
    }
    if (user.status === 'locked') {
      return res.status(403).json({ message: 'Tài khoản đã bị khóa' });
    }

    req.user = { id: user.id, email: user.email, role: user.role };
    next();
  } catch (error) {
    return res.status(401).json({ message: 'Token không hợp lệ hoặc đã hết hạn' });
  }
}

module.exports = verifyToken;