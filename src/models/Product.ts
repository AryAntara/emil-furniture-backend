import { DataTypes, Model } from "sequelize";
import { sequelize } from "../database";

export class Product extends Model {}

Product.init(
  {
    id: {
      type: DataTypes.INTEGER,
      autoIncrement: true,
      primaryKey: true,
    },
    image: DataTypes.STRING,
    name: DataTypes.STRING,
    price: DataTypes.DOUBLE,
    description: DataTypes.STRING,
    weight: DataTypes.DOUBLE,
    stock: DataTypes.INTEGER,
    createdAt: DataTypes.DATE,
    updatedAt: DataTypes.DATE,
    deletedAt: DataTypes.DATE,
  },
  {
    paranoid: true,
    sequelize,
    modelName: "product",
  }
);
