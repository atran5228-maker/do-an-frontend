const { DataTypes } = require('sequelize');
const { sequelize } = require('../config/db');
const User = require('./User');
const Wallet = require('./Wallet');
const Category = require('./Category');

const Transaction = sequelize.define('Transaction', {
  id: {
    type: DataTypes.INTEGER,
    primaryKey: true,
    autoIncrement: true,
  },
  amount: {
    type: DataTypes.DECIMAL(15, 2),
    allowNull: false,
  },
  type: {
    type: DataTypes.ENUM('income', 'expense'),
    allowNull: false,
  },
  note: {
    type: DataTypes.STRING,
    allowNull: true,
  },
  transaction_date: {
    type: DataTypes.DATEONLY, // chỉ lưu ngày, không lưu giờ:phút:giây
    allowNull: false,
    defaultValue: DataTypes.NOW,
  },
}, {
  tableName: 'transactions',
  timestamps: true,
});

// Quan hệ: 1 User có nhiều Transaction
User.hasMany(Transaction, { foreignKey: 'user_id', onDelete: 'CASCADE' });
Transaction.belongsTo(User, { foreignKey: 'user_id' });

// Quan hệ: 1 Wallet có nhiều Transaction
Wallet.hasMany(Transaction, { foreignKey: 'wallet_id', onDelete: 'CASCADE' });
Transaction.belongsTo(Wallet, { foreignKey: 'wallet_id' });

// Quan hệ: 1 Category có nhiều Transaction
Category.hasMany(Transaction, { foreignKey: 'category_id', onDelete: 'CASCADE' });
Transaction.belongsTo(Category, { foreignKey: 'category_id' });

module.exports = Transaction;