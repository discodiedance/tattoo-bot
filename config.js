import dotenv from "dotenv";

dotenv.config();

export const TELEGRAM_TOKEN = process.env.TELEGRAM_TOKEN;
export const MASTER_CHAT_ID = process.env.MASTER_CHAT_ID;
export const MONGO_URL = process.env.MONGO_URL;
export const MASTER_LOGIN = process.env.MASTER_LOGIN;

if (!TELEGRAM_TOKEN) {
  throw new Error("Токен бота не найден! Проверьте .env файл");
}

if (!MASTER_CHAT_ID) {
  throw new Error("ID чата мастера не найден! Проверьте .env файл");
}

if (!MONGO_URL) {
  throw new Error("URL базы данных не найден! Проверьте .env файл");
}

if (!MASTER_LOGIN) {
  throw new Error("Логин мастера не найден! Проверьте .env файл");
}
