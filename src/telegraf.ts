import { Telegraf } from "telegraf";

const botToken = process.env.BOT_TOKEN ?? '';
export const telegramBot = new Telegraf(botToken);
telegramBot.launch();