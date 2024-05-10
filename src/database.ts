import { Sequelize } from "sequelize";

let db_name = process.env.DB_NAME ?? 'mysql',
    username = process.env.DB_USERNAME ?? 'root',
    password = process.env.DB_PASSOWRD,
    db_host = process.env.DB_HOST ?? '0.0.0.0'

export const sequelize = new Sequelize(
    db_name,
    username,
    password,
    {
        dialect: 'mysql',
        host: db_host
    },
)