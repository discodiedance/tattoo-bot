import { PRICE_TEXT } from "../common/texts.js";
import { mainMenuKeyboard } from "../utils/keyboards.js";

export function showPrice(ctx) {
  return ctx.reply(PRICE_TEXT, mainMenuKeyboard);
}

export function setupPriceHandlers(bot) {
  bot.hears("Прайс", showPrice);
  bot.command("price", showPrice);
}
