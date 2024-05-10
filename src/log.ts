import * as winston from "winston";

const { combine, timestamp, label, prettyPrint, colorize } = winston.format;
const appName = process.env.APP_NAME ?? "product";

export const logLevel = {
    error: 0,
    warn: 1,
    info: 2,
    http: 3,
    verbose: 4,
    debug: 5,
    silly: 6
};

export const logger = winston.createLogger({
    format: combine(
        label({ label: appName }),
        timestamp(),
        prettyPrint(),
    ),
    transports: [
        new winston.transports.Console(),
        new winston.transports.File({ filename: './logs/error.log', level: 'error' }),
        new winston.transports.File({ filename: './logs/all.log' })
    ]
});
