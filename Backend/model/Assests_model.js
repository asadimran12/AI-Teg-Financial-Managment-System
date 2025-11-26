const { DataTypes } = require("sequelize");
const sequelize = require("../db");

const Asset = sequelize.define(
  "Asset",
  {
    name: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    category: {
      type: DataTypes.STRING, // e.g., Equipment, Property, Vehicle
      allowNull: false,
    },
    purchase_date: {
      type: DataTypes.DATEONLY, // store only YYYY-MM-DD
      allowNull: false,
    },
    value: {
      type: DataTypes.FLOAT,
      allowNull: false,
    },
    quantity: {
      type: DataTypes.INTEGER,
      allowNull: false,
      defaultValue: 1,
    },
    location: {
      type: DataTypes.STRING, // optional: where the asset is stored
      allowNull: true,
    },
  },
  {
    tableName: "assets",
    timestamps: true, // includes createdAt and updatedAt
  }
);

module.exports = Asset;
