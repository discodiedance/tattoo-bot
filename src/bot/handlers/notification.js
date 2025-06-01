import { MASTER_CHAT_ID } from "../../../config.js";
import { User } from "../../db/models/user.js";

export async function sendNotification(ctx) {
  if (ctx.from.id.toString() !== MASTER_CHAT_ID) return;
  const allUserIds = await User.find({}).distinct("telegramId");

  for (const userId of allUserIds) {
    ctx.telegram.sendMessage(
      userId,
      ctx.message.text.split(" ").slice(1).join(" ")
    );
  }
}

export function setupSendNotificationHandler(bot) {
  bot.command("notification", sendNotification);
}
