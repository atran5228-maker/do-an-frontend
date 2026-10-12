const { Op } = require('sequelize');
const bcrypt = require('bcryptjs');
const User = require('../models/User');
const Transaction = require('../models/Transaction');
const Wallet = require('../models/Wallet');
const Category = require('../models/Category');
const Budget = require('../models/Budget');
const SavingsGoal = require('../models/SavingsGoal');

// Thống kê tổng quan toàn hệ thống
async function getStats(req, res) {
  try {
    const [
      totalUsers,
      lockedUsers,
      totalTransactions,
      totalWallets,
      totalCategories,
      totalBudgets,
      totalGoals,
      completedGoals,
      latestUsers,
    ] = await Promise.all([
      User.count(),
      User.count({ where: { status: 'locked' } }),
      Transaction.count(),
      Wallet.count(),
      Category.count(),
      Budget.count(),
      SavingsGoal.count(),
      SavingsGoal.count({ where: { status: 'completed' } }),
      User.findAll({
        order: [['createdAt', 'DESC']],
        limit: 5,
        attributes: ['id', 'username', 'email', 'role', 'status', 'createdAt'],
      }),
    ]);

    return res.status(200).json({
      totals: {
        users: totalUsers,
        lockedUsers,
        transactions: totalTransactions,
        wallets: totalWallets,
        categories: totalCategories,
        budgets: totalBudgets,
        goals: totalGoals,
        completedGoals,
      },
      latestUsers,
    });
  } catch (error) {
    return res.status(500).json({ message: 'Lỗi server', error: error.message });
  }
}

// Danh sách toàn bộ user, có tìm kiếm theo tên/email
async function getUsers(req, res) {
  try {
    const { search } = req.query;

    const where = search
      ? {
          [Op.or]: [
            { username: { [Op.like]: `%${search}%` } },
            { email: { [Op.like]: `%${search}%` } },
          ],
        }
      : {};

    const users = await User.findAll({
      where,
      order: [['createdAt', 'DESC']],
      attributes: ['id', 'username', 'email', 'role', 'status', 'createdAt'],
    });

    const usersWithCount = await Promise.all(
      users.map(async (u) => {
        const txCount = await Transaction.count({ where: { user_id: u.id } });
        return { ...u.toJSON(), txCount };
      })
    );

    return res.status(200).json(usersWithCount);
  } catch (error) {
    return res.status(500).json({ message: 'Lỗi server', error: error.message });
  }
}

// Khóa / mở khóa tài khoản
async function setStatus(req, res) {
  try {
    const { id } = req.params;
    const { status } = req.body;

    if (!['active', 'locked'].includes(status)) {
      return res.status(400).json({ message: 'status phải là active hoặc locked' });
    }

    const user = await User.findByPk(id);
    if (!user) {
      return res.status(404).json({ message: 'Không tìm thấy người dùng' });
    }
    if (user.role === 'admin') {
      return res.status(403).json({ message: 'Không thể khóa tài khoản quản trị viên' });
    }

    await user.update({ status });
    return res.status(200).json({ message: 'Cập nhật trạng thái thành công' });
  } catch (error) {
    return res.status(500).json({ message: 'Lỗi server', error: error.message });
  }
}

// Đặt lại mật khẩu cho user (admin thực hiện thay)
async function resetPassword(req, res) {
  try {
    const { id } = req.params;
    const { newPassword } = req.body;

    if (!newPassword || newPassword.length < 6) {
      return res.status(400).json({ message: 'Mật khẩu mới phải có ít nhất 6 ký tự' });
    }

    const user = await User.findByPk(id);
    if (!user) {
      return res.status(404).json({ message: 'Không tìm thấy người dùng' });
    }

    const hashedPassword = await bcrypt.hash(newPassword, 10);
    await user.update({ password: hashedPassword });

    return res.status(200).json({ message: 'Đặt lại mật khẩu thành công' });
  } catch (error) {
    return res.status(500).json({ message: 'Lỗi server', error: error.message });
  }
}

// Xóa vĩnh viễn user
async function removeUser(req, res) {
  try {
    const { id } = req.params;
    const user = await User.findByPk(id);

    if (!user) {
      return res.status(404).json({ message: 'Không tìm thấy người dùng' });
    }
    if (user.role === 'admin') {
      return res.status(403).json({ message: 'Không thể xóa tài khoản quản trị viên' });
    }

    // onDelete: 'CASCADE' ở các model liên quan sẽ xóa theo dữ liệu của user này
    await user.destroy();
    return res.status(200).json({ message: 'Đã xóa người dùng' });
  } catch (error) {
    return res.status(500).json({ message: 'Lỗi server', error: error.message });
  }
}

module.exports = { getStats, getUsers, setStatus, resetPassword, removeUser };