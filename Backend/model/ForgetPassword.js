// models/ForgetPassword.js
const { DataTypes } = require("sequelize");
const sequelize = require("../db");

const ForgetPassword = sequelize.define("ForgetPassword", {
  email: {
    type: DataTypes.STRING,
    allowNull: false,
    unique: true,
  },
  pin: {
    type: DataTypes.STRING,
    allowNull: false,
  },
}, {
  tableName: "forget_password",
  timestamps: true,
});

module.exports = ForgetPassword;
