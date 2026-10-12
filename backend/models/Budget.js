const { DataTypes } = require('sequelize');
const { sequelize } = require('../config/db');
const User = require('./User');
const Category = require('./Category');

const Budget = sequelize.define('Budget', {
  id: {
    type: DataTypes.INTEGER,
    primaryKey: true,
    autoIncrement: true,
  },
  limit_amount: {
    type: DataTypes.DECIMAL(15, 2),
    allowNull: false,
  },
  period_start: {
    type: DataTypes.DATEONLY,
    allowNull: false,
  },
  period_end: {
    type: DataTypes.DATEONLY,
    allowNull: false,
  },
}, {
  tableName: 'budgets',
  timestamps: true,
});

User.hasMany(Budget, { foreignKey: 'user_id', onDelete: 'CASCADE' });
Budget.belongsTo(User, { foreignKey: 'user_id' });

Category.hasMany(Budget, { foreignKey: 'category_id', onDelete: 'CASCADE' });
Budget.belongsTo(Category, { foreignKey: 'category_id' });

module.exports = Budget;