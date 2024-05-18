import { Model, DataTypes } from 'sequelize';
import { sequelize } from "../database"
import { User } from './User';

export class Address extends Model { }

Address.init(
    {
        id: {
            type: DataTypes.INTEGER,
            autoIncrement: true,
            primaryKey: true
        },
        userId: DataTypes.INTEGER,
        title: DataTypes.STRING,
        description: DataTypes.STRING,
        isActived: DataTypes.ENUM('yes', 'no'),
        createdAt: DataTypes.DATE,
        updatedAt: DataTypes.DATE,
        deletedAt: DataTypes.DATE
    },
    { sequelize, modelName: 'address', paranoid: true },
);


