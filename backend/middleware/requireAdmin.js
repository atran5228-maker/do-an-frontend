function requireAdmin(req, res, next) {
  if (!req.user || req.user.role !== 'admin') {
    return res.status(403).json({ message: 'Yêu cầu quyền quản trị viên' });
  }
  next();
}

module.exports = requireAdmin;