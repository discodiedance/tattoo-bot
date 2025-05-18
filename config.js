import dotenv from "dotenv";

dotenv.config();

export const TELEGRAM_TOKEN = process.env.TELEGRAM_TOKEN;
export const MASTER_CHAT_ID = process.env.MASTER_CHAT_ID;

if (!TELEGRAM_TOKEN) {
  throw new Error("Токен бота не найден! Проверьте .env файл");
}

if (!MASTER_CHAT_ID) {
  throw new Error("ID чата мастера не найден! Проверьте .env файл");
}
