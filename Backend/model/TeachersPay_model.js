// models/Course.js
const { DataTypes } = require("sequelize");
const sequelize = require("../db"); // Your Sequelize instance

const TachersPay = sequelize.define(
  "TachersPay",
  {
    name: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    pay: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    status: {
      type: DataTypes.ENUM("paid", "unpaid"),
      allowNull: false,
    },
  },
  {
    tableName: "tachersPay",
    timestamps: true,
  }
);

module.exports = TachersPay;
