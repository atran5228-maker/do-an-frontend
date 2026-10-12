const { DataTypes } = require('sequelize');
const { sequelize } = require('../config/db');
const User = require('./User');

const SavingsGoal = sequelize.define('SavingsGoal', {
  id: {
    type: DataTypes.INTEGER,
    primaryKey: true,
    autoIncrement: true,
  },
  name: {
    type: DataTypes.STRING,
    allowNull: false,
  },
  target_amount: {
    type: DataTypes.DECIMAL(15, 2),
    allowNull: false,
  },
  current_amount: {
    type: DataTypes.DECIMAL(15, 2),
    allowNull: false,
    defaultValue: 0,
  },
  deadline: {
    type: DataTypes.DATEONLY,
    allowNull: true,
  },
  status: {
    type: DataTypes.ENUM('in_progress', 'completed'),
    allowNull: false,
    defaultValue: 'in_progress',
  },
}, {
  tableName: 'savings_goals',
  timestamps: true,
});

User.hasMany(SavingsGoal, { foreignKey: 'user_id', onDelete: 'CASCADE' });
SavingsGoal.belongsTo(User, { foreignKey: 'user_id' });

module.exports = SavingsGoal;