const { Op } = require('sequelize');
const Budget = require('../models/Budget');
const Transaction = require('../models/Transaction');

// Lấy tất cả ngân sách, kèm tính toán "đã chi bao nhiêu" cho mỗi cái
async function getBudgets(req, res) {
  try {
    const budgets = await Budget.findAll({
      where: { user_id: req.user.id },
      order: [['createdAt', 'DESC']],
    });

    // Với mỗi ngân sách, tính tổng tiền đã chi trong đúng danh mục + khoảng thời gian đó
    const budgetsWithProgress = await Promise.all(
      budgets.map(async (budget) => {
        const totalSpent = await Transaction.sum('amount', {
          where: {
            user_id: req.user.id,
            category_id: budget.category_id,
            type: 'expense',
            transaction_date: {
              [Op.between]: [budget.period_start, budget.period_end],
            },
          },
        });

        const spent = totalSpent || 0; // nếu chưa có giao dịch nào, sum() trả về null
        const percentage = (spent / parseFloat(budget.limit_amount)) * 100;

        return {
          ...budget.toJSON(), // chuyển budget từ object Sequelize sang object JS thường
          spent,
          remaining: parseFloat(budget.limit_amount) - spent,
          percentage: Math.round(percentage),
          isOverBudget: spent > parseFloat(budget.limit_amount),
        };
      })
    );

    return res.status(200).json(budgetsWithProgress);
  } catch (error) {
    return res.status(500).json({ message: 'Lỗi server', error: error.message });
  }
}

// Tạo ngân sách mới
async function createBudget(req, res) {
  try {
    const { category_id, limit_amount, period_start, period_end } = req.body;

    if (!category_id || !limit_amount || !period_start || !period_end) {
      return res.status(400).json({ message: 'Vui lòng nhập đủ category_id, limit_amount, period_start, period_end' });
    }

    const newBudget = await Budget.create({
      category_id,
      limit_amount,
      period_start,
      period_end,
      user_id: req.user.id,
    });

    return res.status(201).json(newBudget);
  } catch (error) {
    return res.status(500).json({ message: 'Lỗi server', error: error.message });
  }
}

// Sửa ngân sách
async function updateBudget(req, res) {
  try {
    const { id } = req.params;
    const budget = await Budget.findOne({ where: { id, user_id: req.user.id } });

    if (!budget) {
      return res.status(404).json({ message: 'Không tìm thấy ngân sách' });
    }

    const { limit_amount, period_start, period_end } = req.body;
    await budget.update({ limit_amount, period_start, period_end });

    return res.status(200).json(budget);
  } catch (error) {
    return res.status(500).json({ message: 'Lỗi server', error: error.message });
  }
}

// Xóa ngân sách
async function deleteBudget(req, res) {
  try {
    const { id } = req.params;
    const budget = await Budget.findOne({ where: { id, user_id: req.user.id } });

    if (!budget) {
      return res.status(404).json({ message: 'Không tìm thấy ngân sách' });
    }

    await budget.destroy();
    return res.status(200).json({ message: 'Đã xóa ngân sách' });
  } catch (error) {
    return res.status(500).json({ message: 'Lỗi server', error: error.message });
  }
}

module.exports = { getBudgets, createBudget, updateBudget, deleteBudget };