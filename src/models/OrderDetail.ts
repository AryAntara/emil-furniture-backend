import { Model, DataType, DataTypes } from "sequelize";
import { sequelize } from "../database";

export class OrderDetail extends Model {}
OrderDetail.init(
  {
    id: {
      type: DataTypes.INTEGER,
      autoIncrement: true,
      primaryKey: true,
    },
    orderId: DataTypes.INTEGER,
    productId: DataTypes.INTEGER,
    productName: DataTypes.STRING,
    productImage: DataTypes.STRING,
    price: DataTypes.DOUBLE,
    qty: DataTypes.INTEGER,
    lockedIn: DataTypes.DATE,
    status: DataTypes.ENUM("ready", "out_of_stock", "process"),
    isUsed: DataTypes.ENUM("yes", "no"),
    createdAt: DataTypes.DATE,
    updatedAt: DataTypes.DATE,
    deletedAt: DataTypes.DATE,
  },
  { sequelize, paranoid: true, tableName: 
    'order_details'
  }
);
