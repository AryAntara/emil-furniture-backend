import { Model, DataTypes } from "sequelize";
import { sequelize } from "../database";

export class OrderDetail extends Model {}

OrderDetail.init(
  {
    id: {
      type: DataTypes.INTEGER,
      primaryKey: true,
      autoIncrement: true,
    },
    orderId: DataTypes.INTEGER,
    productId: DataTypes.INTEGER,
    price: DataTypes.DOUBLE,
    qty: DataTypes.INTEGER,
    stockId: DataTypes.INTEGER,
    createdAt: DataTypes.DATE,
    updatedAt: DataTypes.DATE,
    deletedAt: DataTypes.DATE,
  },
  { sequelize, paranoid: true, tableName: "order_details" }
);
