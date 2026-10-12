const { DataTypes } = require('sequelize');
const { sequelize } = require('../config/db');
const User = require('./User');

const Wallet = sequelize.define('Wallet', {
  id: {
    type: DataTypes.INTEGER,
    primaryKey: true,
    autoIncrement: true,
  },
  name: {
    type: DataTypes.STRING,
    allowNull: false,
  },
  type: {
    type: DataTypes.STRING, // vd: "cash", "bank", "e-wallet"
    allowNull: false,
  },
  balance: {
    type: DataTypes.DECIMAL(15, 2), // 15 chữ số, 2 số thập phân - đủ cho số tiền lớn
    allowNull: false,
    defaultValue: 0,
  },
}, {
  tableName: 'wallets',
  timestamps: true,
});

User.hasMany(Wallet, { foreignKey: 'user_id', onDelete: 'CASCADE' });
Wallet.belongsTo(User, { foreignKey: 'user_id' });

module.exports = Wallet;