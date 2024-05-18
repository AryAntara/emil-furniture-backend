import { Model, DataTypes } from 'sequelize';
import { sequelize } from "../database"


export class Category extends Model { }

Category.init(
    {
        id: {
            type: DataTypes.INTEGER,
            autoIncrement: true,
            primaryKey: true
        },
        name: DataTypes.STRING,
        createdAt: DataTypes.DATE,
        updatedAt: DataTypes.DATE,
        deletedAt: DataTypes.DATE
    },
    { sequelize, modelName: 'category', paranoid: true },
);


