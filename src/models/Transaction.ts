import { DataTypes, Model } from "sequelize";
import { sequelize } from "../database";

export class Transaction extends Model {}
Transaction.init(
  {
    id: {
        type: DataTypes.UUID,
        primaryKey: true
    },
    address: DataTypes.TEXT,
    orderId: DataTypes.INTEGER,
    priceTotal: DataTypes.DOUBLE,
    qtyTotal: DataTypes.INTEGER,
    resi: DataTypes.STRING,
    resiLink: DataTypes.STRING,
    status: DataTypes.ENUM("unpaid", "paid", "canceled"),
    createdAt: DataTypes.DATE,
    updatedAt: DataTypes.DATE,
    deletedAt: DataTypes.DATE,
  },
  { sequelize, paranoid: true }
);
