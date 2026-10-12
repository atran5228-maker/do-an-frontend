const Wallet = require('../models/Wallet');
const { sequelize } = require('../config/db');

// Lấy tất cả ví của user đang đăng nhập
async function getWallets(req, res) {
  try {
    const wallets = await Wallet.findAll({
      where: { user_id: req.user.id },
      order: [['createdAt', 'DESC']],
    });
    return res.status(200).json(wallets);
  } catch (error) {
    return res.status(500).json({ message: 'Lỗi server', error: error.message });
  }
}

// Tạo ví mới
async function createWallet(req, res) {
  try {
    const { name, type, balance } = req.body;

    if (!name || !type) {
      return res.status(400).json({ message: 'Vui lòng nhập name và type' });
    }

    const newWallet = await Wallet.create({
      name,
      type,
      balance: balance || 0, // nếu không nhập số dư ban đầu, mặc định 0
      user_id: req.user.id,
    });

    return res.status(201).json(newWallet);
  } catch (error) {
    return res.status(500).json({ message: 'Lỗi server', error: error.message });
  }
}

// Sửa ví
async function updateWallet(req, res) {
  try {
    const { id } = req.params;
    const wallet = await Wallet.findOne({ where: { id, user_id: req.user.id } });

    if (!wallet) {
      return res.status(404).json({ message: 'Không tìm thấy ví' });
    }

    const { name, type } = req.body;
    // Lưu ý: KHÔNG cho sửa "balance" trực tiếp ở đây
    // vì số dư chỉ nên thay đổi thông qua giao dịch/chuyển tiền, tránh làm sai lệch dữ liệu
    await wallet.update({ name, type });

    return res.status(200).json(wallet);
  } catch (error) {
    return res.status(500).json({ message: 'Lỗi server', error: error.message });
  }
}

// Xóa ví
async function deleteWallet(req, res) {
  try {
    const { id } = req.params;
    const wallet = await Wallet.findOne({ where: { id, user_id: req.user.id } });

    if (!wallet) {
      return res.status(404).json({ message: 'Không tìm thấy ví' });
    }

    await wallet.destroy();
    return res.status(200).json({ message: 'Đã xóa ví' });
  } catch (error) {
    return res.status(500).json({ message: 'Lỗi server', error: error.message });
  }
}

// Chuyển tiền giữa 2 ví
async function transferMoney(req, res) {
  const t = await sequelize.transaction(); // bắt đầu 1 "transaction"
  try {
    const { from_wallet_id, to_wallet_id, amount } = req.body;

    if (!from_wallet_id || !to_wallet_id || !amount) {
      await t.rollback();
      return res.status(400).json({ message: 'Vui lòng nhập đủ from_wallet_id, to_wallet_id, amount' });
    }
    if (from_wallet_id === to_wallet_id) {
      await t.rollback();
      return res.status(400).json({ message: 'Không thể chuyển tiền tới cùng 1 ví' });
    }
    if (amount <= 0) {
      await t.rollback();
      return res.status(400).json({ message: 'Số tiền chuyển phải lớn hơn 0' });
    }

    // Tìm 2 ví, đảm bảo đều thuộc về user đang đăng nhập
    const fromWallet = await Wallet.findOne({ where: { id: from_wallet_id, user_id: req.user.id }, transaction: t });
    const toWallet = await Wallet.findOne({ where: { id: to_wallet_id, user_id: req.user.id }, transaction: t });

    if (!fromWallet || !toWallet) {
      await t.rollback();
      return res.status(404).json({ message: 'Không tìm thấy ví nguồn hoặc ví đích' });
    }

    if (parseFloat(fromWallet.balance) < parseFloat(amount)) {
      await t.rollback();
      return res.status(400).json({ message: 'Số dư ví nguồn không đủ' });
    }

    // Trừ tiền ví nguồn, cộng tiền ví đích
    fromWallet.balance = parseFloat(fromWallet.balance) - parseFloat(amount);
    toWallet.balance = parseFloat(toWallet.balance) + parseFloat(amount);

    await fromWallet.save({ transaction: t });
    await toWallet.save({ transaction: t });

    await t.commit(); // xác nhận cả 2 thay đổi cùng lúc

    return res.status(200).json({
      message: 'Chuyển tiền thành công',
      fromWallet,
      toWallet,
    });
  } catch (error) {
    await t.rollback();
    return res.status(500).json({ message: 'Lỗi server', error: error.message });
  }
}

module.exports = { getWallets, createWallet, updateWallet, deleteWallet, transferMoney };