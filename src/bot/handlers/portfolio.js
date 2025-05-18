import { PORTFOLIO_TEXT } from "../common/texts.js";
import { mainMenuKeyboard } from "../utils/keyboards.js";

export function showPortfolio(ctx) {
  return ctx.reply(PORTFOLIO_TEXT, mainMenuKeyboard);
}

export function setupPortfolioHandlers(bot) {
  bot.hears("Портфолио", showPortfolio);
  bot.command("portfolio", showPortfolio);
}
