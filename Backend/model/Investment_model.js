const { DataTypes } = require("sequelize");
const sequelize = require("../db");

const Investment = sequelize.define(
  "Investment",
  {
    Invested_by: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    date: {
      type: DataTypes.DATEONLY,
      allowNull: false,
    },
    amount: {
      type: DataTypes.FLOAT,
      allowNull: false,
    },
    Category: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    Quantity: {
      type: DataTypes.INTEGER,
      allowNull: false,
    },
  },
  {
    tableName: "investments",
    timestamps: true,
  }
  
);

module.exports = Investment;
