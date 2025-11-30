const { DataTypes } = require("sequelize");
const sequelize = require("../db");
const Students = sequelize.define(
  "Sale",
  {
    id: {
      type: DataTypes.INTEGER,
      primaryKey: true,
      autoIncrement: true,
    },

    item: {
      type: DataTypes.STRING,
      allowNull: false,
    },

    customer_name: {
      type: DataTypes.STRING,
      allowNull: false,
    },

    quantity: {
      type: DataTypes.INTEGER,
      allowNull: false,
    },

    price: {
      type: DataTypes.INTEGER,
      allowNull: false,
    },
    discount: {
      type: DataTypes.FLOAT,
      allowNull: false,
    },
    priceafterdiscount: {
      type: DataTypes.FLOAT,
      allowNull: false,
    },

  },
  {
    tableName: "sales",
    timestamps: true,
  }
);
module.exports = Students;