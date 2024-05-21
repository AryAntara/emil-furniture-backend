import { DataTypes, Model } from "sequelize";
import { sequelize } from "../database";

export class ProductCategory extends Model {}

ProductCategory.init(
  {
    id: {
      type: DataTypes.INTEGER,
      primaryKey: true,
      autoIncrement: true,
    },
    productId: DataTypes.INTEGER,
    categoryId: DataTypes.INTEGER,
  },
  {
    tableName: "product_category",
    sequelize, 
    paranoid: true
  }
);
