require('dotenv').config()
const bcrypt = require('bcryptjs')
const User = require('./models/User')

async function run() {
  const email = 'usertest@gmail.com'

  const exists = await User.findOne({ where: { email } })
  if (exists) {
    console.log('Tài khoản thử đã tồn tại:', email)
    process.exit(0)
  }

  await User.create({
    username: 'User Test',
    email,
    password: await bcrypt.hash('123456', 10),
    role: 'user',
    status: 'active',
  })

  console.log('Đã tạo tài khoản thử:', email, '/ mật khẩu 123456')
  process.exit(0)
}

run().catch((e) => {
  console.error('Lỗi:', e.message)
  process.exit(1)
})