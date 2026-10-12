const bcrypt = require('bcryptjs');
const User = require('../models/User');

const PROFILE_FIELDS = [
  'id', 'username', 'email', 'role',
  'avartar_url', 'language', 'currency', 'dark_mode', 'createdAt',
];

// Xem hồ sơ của chính mình
async function getProfile(req, res) {
  try {
    const user = await User.findByPk(req.user.id, { attributes: PROFILE_FIELDS });
    if (!user) {
      return res.status(404).json({ message: 'Không tìm thấy người dùng' });
    }
    return res.status(200).json(user);
  } catch (error) {
    return res.status(500).json({ message: 'Lỗi server', error: error.message });
  }
}

// Cập nhật hồ sơ và cài đặt cá nhân
async function updateProfile(req, res) {
  try {
    const user = await User.findByPk(req.user.id);
    if (!user) {
      return res.status(404).json({ message: 'Không tìm thấy người dùng' });
    }

    const { username, email, avartar_url, language, currency, dark_mode } = req.body || {};

    if (email && email !== user.email) {
      const exists = await User.findOne({ where: { email } });
      if (exists) {
        return res.status(400).json({ message: 'Email này đã được sử dụng' });
      }
    }

    // Trường nào không gửi lên thì giữ nguyên giá trị cũ
    await user.update({
      username: username ?? user.username,
      email: email ?? user.email,
      avartar_url: avartar_url ?? user.avartar_url,
      language: language ?? user.language,
      currency: currency ?? user.currency,
      dark_mode: dark_mode ?? user.dark_mode,
    });

    const updated = await User.findByPk(user.id, { attributes: PROFILE_FIELDS });
    return res.status(200).json(updated);
  } catch (error) {
    return res.status(500).json({ message: 'Lỗi server', error: error.message });
  }
}

// Đổi mật khẩu
async function changePassword(req, res) {
  try {
    const { currentPassword, newPassword } = req.body || {};

    if (!currentPassword || !newPassword) {
      return res.status(400).json({ message: 'Vui lòng nhập mật khẩu hiện tại và mật khẩu mới' });
    }
    if (newPassword.length < 6) {
      return res.status(400).json({ message: 'Mật khẩu mới phải có ít nhất 6 ký tự' });
    }

    const user = await User.findByPk(req.user.id);
    if (!user) {
      return res.status(404).json({ message: 'Không tìm thấy người dùng' });
    }

    const isMatch = await bcrypt.compare(currentPassword, user.password);
    if (!isMatch) {
      // Dùng 400, không dùng 401: interceptor ở frontend gặp 401 sẽ tự đăng xuất người dùng
      return res.status(400).json({ message: 'Mật khẩu hiện tại không đúng' });
    }

    const hashedPassword = await bcrypt.hash(newPassword, 10);
    await user.update({ password: hashedPassword });

    return res.status(200).json({ message: 'Đổi mật khẩu thành công' });
  } catch (error) {
    return res.status(500).json({ message: 'Lỗi server', error: error.message });
  }
}

module.exports = { getProfile, updateProfile, changePassword };