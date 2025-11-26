const { DataTypes } = require("sequelize");
const sequelize = require("../db");

const DailyExpense = sequelize.define(
  "DailyExpense",
  {
    expense_by: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    amount: {
      type: DataTypes.FLOAT,
      allowNull: false,
    },
    category: {
      type: DataTypes.STRING, 
      allowNull: false,
    },
    description: {
      type: DataTypes.STRING,
      allowNull: true,
    },
    date: {
      type: DataTypes.DATEONLY, 
      allowNull: false,
    },
  },
  {
    tableName: "daily_expenses",
    timestamps: true,
  }
);

module.exports = DailyExpense;
