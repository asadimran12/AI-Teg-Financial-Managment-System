const { DataTypes } = require("sequelize");
const sequelize = require("../db");

const Students = sequelize.define(
  "Students",
  {
    name: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    father_name: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    Address: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    Phone_number: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    course: {
      type: DataTypes.JSON, 
      allowNull: false,
    },
    fee: {
      type: DataTypes.FLOAT,
      allowNull: false,
    },
  },
  {
    tableName: "students",
    timestamps: true,
  }
);

module.exports = Students;
