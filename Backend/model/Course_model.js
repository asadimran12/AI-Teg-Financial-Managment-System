// models/Course.js
const { DataTypes } = require("sequelize");
const sequelize = require("../db"); // Your Sequelize instance

const Course = sequelize.define(
  "Course",
  {
    name: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    duration: {
      type: DataTypes.STRING, 
      allowNull: false,
    },
    fee: {
      type: DataTypes.FLOAT,
      allowNull: false,
    },
    description: {
      type: DataTypes.TEXT,
      allowNull: true,
    },
  },
  {
    tableName: "courses",
    timestamps: true, 
  }
);

module.exports = Course;
