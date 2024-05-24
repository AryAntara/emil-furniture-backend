import { DataTypes, Model } from "sequelize";
import { sequelize } from "../database";

export class Stock extends Model {}
Stock.init(
  {
    id: {
      type: DataTypes.INTEGER,
      primaryKey: true,
      autoIncrement: true,
    },
    productId: DataTypes.INTEGER,
    qtyIn: DataTypes.INTEGER,
    qtyOut: DataTypes.INTEGER,
    qtyFinal: DataTypes.INTEGER,
    qtyInitial: DataTypes.INTEGER,
    commitedAt: DataTypes.DATE,
    createdAt: DataTypes.DATE,
    updatedAt: DataTypes.DATE,
    deletedAt: DataTypes.DATE,
  },
  {
    sequelize,
    modelName: "stock",
    paranoid: true
  }
);
