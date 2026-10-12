require('dotenv').config();
const Sequelize = require('sequelize');

const sequelize = new Sequelize(
    process.env.DB_NAME,
    process.env.DB_USER,
    process.env.DB_PASSWORD,
    {
        host: process.env.DB_HOST,
        port: process.env.DB_PORT,
        dialect: 'mysql',
        logging: false, // tắt log câu lệnh SQL in ra terminal cho đỡ rối mắt (bật lại nếu cần debug)
    }
);

async function testConnection() {
    try {
        await sequelize.authenticate();
        console.log('Kết nối cơ sở dữ liệu thành công!');
    }
    catch (error) {
        console.error('Không thể kết nối cơ sở dữ liệu:', error.message);
    }
}

module.exports = { sequelize, testConnection };