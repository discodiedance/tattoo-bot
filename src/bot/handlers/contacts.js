import { mainMenuKeyboard } from "../utils/keyboards.js";
import { CONTACTS_TEXT } from "../common/texts.js";

export function showContacts(ctx) {
  return ctx.reply(CONTACTS_TEXT, mainMenuKeyboard);
}

export function setupContactsHandlers(bot) {
  bot.hears("Мои контакты", showContacts);
  bot.command("contacts", showContacts);
}
