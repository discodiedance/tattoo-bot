import { Markup } from "telegraf";

export const mainMenuKeyboard = Markup.keyboard([
  ["Портфолио"],
  ["Запись на сеанс"],
  ["Прайс", "Мои контакты", "Уход за тату"],
]).resize();

export const aftercareKeyboard = Markup.keyboard([
  ["Классический уход", "Заживляющая пленка"],
  ["Рекомендации"],
  ["Меню"],
]).resize();

export const bookingKeyboard = Markup.keyboard([
  ["Продолжить без фото"],
  ["Отменить запись"],
]).resize();

export const cancelBookingKeyboard = Markup.keyboard([
  ["Отменить запись"],
]).resize();
