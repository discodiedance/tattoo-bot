import { aftercareKeyboard } from "../utils/keyboards.js";
import { AFTERCARE_TEXT } from "../common/texts.js";

export function showAfterCare(ctx) {
  return ctx.reply(AFTERCARE_TEXT.WELCOME, aftercareKeyboard);
}

export function showClassicAfterCare(ctx) {
  return ctx.replyWithMarkdown(AFTERCARE_TEXT.CLASSIC);
}

export function showFilmAfterCare(ctx) {
  return ctx.replyWithMarkdown(AFTERCARE_TEXT.FILM);
}

export function showRecomendations(ctx) {
  return ctx.replyWithMarkdown(AFTERCARE_TEXT.RECOMMENDATIONS);
}

export function setupAftercareHandlers(bot) {
  bot.hears("Уход за тату", showAfterCare);
  bot.command("aftercare", showAfterCare);

  bot.hears("Классический уход", async (ctx) => {
    return await showClassicAfterCare(ctx);
  });

  bot.hears("Заживляющая пленка", async (ctx) => {
    return await showFilmAfterCare(ctx);
  });

  bot.hears("Рекомендации", async (ctx) => {
    return await showRecomendations(ctx);
  });
}
