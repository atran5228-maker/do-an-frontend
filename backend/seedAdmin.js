const bcrypt = require('bcryptjs');
const { Op } = require('sequelize');
const User = require('./models/User');

// Tạo sẵn 1 tài khoản admin cố định khi server khởi động (nếu chưa có).
// Có thể đổi qua file .env: ADMIN_EMAIL, ADMIN_PASSWORD
async function seedAdmin() {
  try {
    const email = process.env.ADMIN_EMAIL || 'admin@finadmin.com';
    const password = process.env.ADMIN_PASSWORD || 'admin123';

    const existingAdmin = await User.findOne({ where: { email } });
    if (existingAdmin) {
      // Đảm bảo tài khoản này luôn có role admin (phòng khi DB cũ chưa có cột role)
      if (existingAdmin.role !== 'admin' || existingAdmin.status !== 'active') {
        existingAdmin.role = 'admin';
        existingAdmin.status = 'active';
        await existingAdmin.save();
        console.log(`Đã nâng quyền admin cho: ${email}`);
      } else {
        console.log(`Tài khoản admin đã tồn tại: ${email}`);
      }
      return;
    }

    const hashedPassword = await bcrypt.hash(password, 10);
    await User.create({
      username: 'Admin',
      email,
      password: hashedPassword,
      role: 'admin',
      status: 'active',
    });
    console.log('==========================================');
    console.log(`Đã tạo tài khoản admin mặc định:`);
    console.log(`  Email: ${email}`);
    console.log(`  Mật khẩu: ${password}`);
    console.log('(Đổi trong backend/.env: ADMIN_EMAIL, ADMIN_PASSWORD)');
    console.log('==========================================');

    // Cảnh báo nếu DB còn user khác (từ lúc test đăng ký trước đó)
    const otherUsers = await User.count({ where: { email: { [Op.ne]: email } } });
    if (otherUsers > 0) {
      console.warn(`⚠️  Còn ${otherUsers} user khác trong DB (không phải admin).
   Muốn chỉ còn đúng 1 tài khoản duy nhất, xóa user thừa trong MySQL:
   DELETE FROM users WHERE email != '${email}';`);
    }
  } catch (error) {
    console.error('Seed admin lỗi:', error.message);
  }
}

module.exports = seedAdmin;

// Chạy trực tiếp: node seedAdmin.js
if (require.main === module) {
  const { sequelize, testConnection } = require('./config/db');
  (async () => {
    await testConnection();
    await sequelize.sync();
    await seedAdmin();
    process.exit(0);
  })();
}
