import { DataTypes, Model } from "sequelize";
import { sequelize } from "../database";

export class Cart extends Model {}

Cart.init(
  {
    id: {
      type: DataTypes.INTEGER,
      autoIncrement: true,
      primaryKey: true,
    },
    userId: DataTypes.INTEGER,
    date: DataTypes.DATEONLY,
    priceTotal: DataTypes.DOUBLE,
    qtyTotal: DataTypes.INTEGER,
    status: DataTypes.ENUM("pending", "process", "paid", "shipped", "canceled"),
    createdAt: DataTypes.DATE,
    updatedAt: DataTypes.DATE,
    deletedAt: DataTypes.DATE,
  },
  { sequelize, paranoid: true }
);
