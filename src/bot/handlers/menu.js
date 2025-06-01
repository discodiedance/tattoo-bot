import { WELCOME_TEXT } from "../common/texts.js";
import { mainMenuKeyboard } from "../utils/keyboards.js";
import { User } from "../../db/models/user.js";

export function showMenu(ctx) {
  return ctx.reply("Меню:", mainMenuKeyboard);
}

export function setupMenuCommands(bot) {
  bot.telegram.setMyCommands([
    { command: "start", description: "Перезапустить бота" },
    { command: "portfolio", description: "Посмотреть портфолио" },
    { command: "booking", description: "Забронировать сеанс" },
    { command: "price", description: "Узнать цены" },
    { command: "contacts", description: "Мои контакты" },
    { command: "aftercare", description: "Уход за тату" },
  ]);

  bot.start(async (ctx) => {
    const { id, username } = ctx.from;
    const user = new User({
      telegramId: id.toString(),
      telegramLogin: username || "Нет логина",
    });

    const existingUser = await User.findOne({ telegramId: id.toString() });
    if (!existingUser) {
      await user.save();
    }

    ctx.reply(WELCOME_TEXT, mainMenuKeyboard);
  });

  bot.hears("Меню", showMenu);
  bot.command("menu", showMenu);
}
