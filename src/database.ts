import { Sequelize } from "sequelize";

let db_name = process.env.DB_NAME ?? 'mysql',
    username = process.env.DB_USERNAME ?? 'root',
    password = process.env.DB_PASSWORD,
    db_host = process.env.DB_HOST ?? '0.0.0.0',
    ssl = process.env.DB_SSL == 'true' || false,
    db_port = parseInt(process.env.DB_PORT as string) || undefined

console.log(ssl, password);
export const sequelize = new Sequelize(
    db_name,
    username,
    password,
    {
        port: db_port,
        dialect: 'mysql',
        host: db_host,
        ssl,
        dialectOptions: {
            ssl: {
                require: ssl,
            }
        }
    },
)