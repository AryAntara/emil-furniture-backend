import { config } from "dotenv";
import { sequelize } from "./database";
import { logger } from "./log";
import { app } from "./app";
import "./models/relations";
import "./telegraf";
config();

// Connect to database
try {
  sequelize.authenticate();
  logger.info("Success connect into database");
} catch (e) {
  logger.error("Cannot connect into database");
}

export default app;
