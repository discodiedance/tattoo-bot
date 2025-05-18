import { Telegraf } from "telegraf";
import { TELEGRAM_TOKEN } from "../../config.js";

export const bot = new Telegraf(TELEGRAM_TOKEN, {
  handlerTimeout: Infinity,
});

bot.catch((err, ctx) => {
  console.error("Ошибка в боте:", err);
  ctx.reply("Произошла ошибка, попробуйте позже");
});
