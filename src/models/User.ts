import { Model, DataTypes } from 'sequelize';
import { sequelize } from "../database"
import { Address } from './Address';

export class User extends Model { }

User.init(
    {
        id: {
            type: DataTypes.INTEGER,
            autoIncrement: true,
            primaryKey: true
        },
        email: DataTypes.STRING,
        fullname: DataTypes.STRING,
        password: DataTypes.STRING,
        phoneNumber: DataTypes.INTEGER,
        roleUser: DataTypes.ENUM("normal", "admin"),
        verifiedAt: DataTypes.DATE,
        createdAt: DataTypes.DATE,
        updatedAt: DataTypes.DATE,
        deletedAt: DataTypes.DATE
    },
    { sequelize, modelName: 'user', paranoid: true },
);
