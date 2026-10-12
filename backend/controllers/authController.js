const bcrypt = require('bcryptjs');
const User = require('../models/User');

async function register(req, res) {
    try {
        const {name, email, password} = req.body;
        if (!name || !email || !password) {
            return res.status(400).json({message: 'Vui lòng điền đầy đủ thông tin'});
        }
        const existingUser = await User.findOne({where: {email}});
        if (existingUser) {
            return res.status(400).json({message: 'Email đã tồn tại'});
        }
        const hashedPassword = await bcrypt.hash(password, 10);
        const newUser = await User.create({
            username: name,
            email,
            password: hashedPassword,
        });
        return res.status(201).json({
            message: 'Đăng ký thành công',
            user: {
                id: user.id,
                name: user.name,
                email: user.email,
                role: user.role,
                },
        });
    } catch (error) {
        console.error(error);
        return res.status(500).json({message: 'Đã xảy ra lỗi khi đăng ký'});
    }
}
    const jwt = require('jsonwebtoken');
    async function login(req, res) {
        try {
            const {email, password} = req.body;
            if (!email || !password) {
                return res.status(400).json({message: 'Vui lòng điền đầy đủ thông tin'});
            }
            const user = await User.findOne({where: {email}});
            if (!user) {
                return res.status(400).json({message: 'Email hoặc mật khẩu không đúng'});
            }
            const isMatch = await bcrypt.compare(password, user.password);
            if (user.status === 'locked') {
                return res.status(403).json({ message: 'Tài khoản đã bị khóa, vui lòng liên hệ quản trị viên' });
            }
            if (!isMatch) {
                return res.status(400).json({message: 'Email hoặc mật khẩu không đúng'});
            }
            if (user.status === 'locked') {
                return res.status(403).json({message: 'Tài khoản đã bị khóa. Vui lòng liên hệ quản trị viên.'});
            }
            const token = jwt.sign(
                { id: user.id, email: user.email, role: user.role },
                process.env.JWT_SECRET,
                { expiresIn: '7d' } 
            );
            return res.status(200).json({
                message: 'Đăng nhập thành công',
                token,
                user: {
                    id: user.id,
                    name: user.username,
                    email: user.email,
                    role: user.role,
                    status: user.status,
                },
            });
        }catch (error) {
            console.error(error);
            return res.status(500).json({message: 'Đã xảy ra lỗi khi đăng nhập', error: error.message});
        }
    }
module.exports = {register, login};