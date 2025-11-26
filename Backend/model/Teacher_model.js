const { DataTypes } = require("sequelize");
const sequelize = require("../db");

const Teachers = sequelize.define(
  "Teachers",
  {
    name: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    email: {
      type: DataTypes.STRING,
      allowNull: false,
      unique: true,
    },
    Phone_number: {
      type: DataTypes.STRING,
      allowNull: false,
    },

    courses: {
      type: DataTypes.JSON,
      allowNull: false,
    },
    pay: {
      type: DataTypes.FLOAT,
      allowNull: false,
    },
    pay_status: {
      type: DataTypes.ENUM("paid", "unpaid"),
      defaultValue: "unpaid",
    },
  },
  {
    tableName: "teachers",
    timestamps: true,
  }
);

module.exports = Teachers;
