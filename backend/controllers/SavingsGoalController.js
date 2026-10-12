const SavingsGoal = require('../models/SavingsGoal');

async function getSavingsGoals(req, res) {
  try {
    const goals = await SavingsGoal.findAll({
      where: { user_id: req.user.id },
      order: [['createdAt', 'DESC']],
    });
    return res.status(200).json(goals);
  } catch (error) {
    return res.status(500).json({ message: 'Lỗi server', error: error.message });
  }
}

async function createSavingsGoal(req, res) {
  try {
    const { name, target_amount, deadline } = req.body;

    if (!name || !target_amount) {
      return res.status(400).json({ message: 'Vui lòng nhập name và target_amount' });
    }

    const newGoal = await SavingsGoal.create({
      name,
      target_amount,
      deadline,
      user_id: req.user.id,
    });

    return res.status(201).json(newGoal);
  } catch (error) {
    return res.status(500).json({ message: 'Lỗi server', error: error.message });
  }
}

// Cập nhật tiến độ: cộng thêm tiền vào current_amount, tự chuyển status nếu đạt mục tiêu
async function updateProgress(req, res) {
  try {
    const { id } = req.params;
    const { amount } = req.body; // số tiền vừa tiết kiệm thêm

    if (!amount || amount <= 0) {
      return res.status(400).json({ message: 'amount phải lớn hơn 0' });
    }

    const goal = await SavingsGoal.findOne({ where: { id, user_id: req.user.id } });
    if (!goal) {
      return res.status(404).json({ message: 'Không tìm thấy mục tiêu' });
    }

    const newCurrentAmount = parseFloat(goal.current_amount) + parseFloat(amount);
    const isCompleted = newCurrentAmount >= parseFloat(goal.target_amount);

    await goal.update({
      current_amount: newCurrentAmount,
      status: isCompleted ? 'completed' : 'in_progress',
    });

    return res.status(200).json(goal);
  } catch (error) {
    return res.status(500).json({ message: 'Lỗi server', error: error.message });
  }
}

async function updateSavingsGoal(req, res) {
  try {
    const { id } = req.params;
    const goal = await SavingsGoal.findOne({ where: { id, user_id: req.user.id } });

    if (!goal) {
      return res.status(404).json({ message: 'Không tìm thấy mục tiêu' });
    }

    const { name, target_amount, deadline } = req.body;
    await goal.update({ name, target_amount, deadline });

    return res.status(200).json(goal);
  } catch (error) {
    return res.status(500).json({ message: 'Lỗi server', error: error.message });
  }
}

async function deleteSavingsGoal(req, res) {
  try {
    const { id } = req.params;
    const goal = await SavingsGoal.findOne({ where: { id, user_id: req.user.id } });

    if (!goal) {
      return res.status(404).json({ message: 'Không tìm thấy mục tiêu' });
    }

    await goal.destroy();
    return res.status(200).json({ message: 'Đã xóa mục tiêu' });
  } catch (error) {
    return res.status(500).json({ message: 'Lỗi server', error: error.message });
  }
}

module.exports = { getSavingsGoals, createSavingsGoal, updateProgress, updateSavingsGoal, deleteSavingsGoal };