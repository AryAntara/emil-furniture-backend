import { DataTypes, Model } from "sequelize";
import { sequelize } from "../database";

export class Order extends Model {}
Order.init(
  {
    id: {
      type: DataTypes.INTEGER,
      autoIncrement: true,
      primaryKey: true,
    },
    userId: DataTypes.INTEGER,
    priceTotal: DataTypes.DOUBLE,
    qtyTotal: DataTypes.INTEGER,
    status: DataTypes.ENUM("pending", "canceled", "in_transaction"),
    canceledIn: DataTypes.DATE,
    createdAt: DataTypes.DATE,
    updatedAt: DataTypes.DATE,
    deletedAt: DataTypes.DATE,
  },
  { sequelize, paranoid: true }
);
