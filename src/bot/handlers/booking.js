import { BOOKINT_TEXTS } from "../common/texts.js";
import {
  bookingKeyboard,
  mainMenuKeyboard,
  cancelBookingKeyboard,
} from "../utils/keyboards.js";

const userStates = {};
const lastBookingTimestamps = {};

function canUserBook(userId) {
  const lastBooking = lastBookingTimestamps[userId];
  if (!lastBooking) return true;

  const oneDay = 24 * 60 * 60 * 1000;
  return Date.now() - lastBooking >= oneDay;
}

async function startBooking(ctx) {
  const user = ctx.from;

  if (!canUserBook(user.id)) {
    return ctx.reply(
      "Вы уже делали запись сегодня. Пожалуйста, попробуйте завтра. Либо свяжитесь с мастером: @snezhok_pi",
      mainMenuKeyboard
    );
  }

  userStates[ctx.from.id] = {
    step: "description",
    username: user.username
      ? `@${user.username}`
      : `${user.first_name}${user.last_name ? ` ${user.last_name}` : ""}`,
  };
  await ctx.reply(BOOKINT_TEXTS.start, cancelBookingKeyboard);
}

async function handlePhoto(ctx, userState) {
  userState.step = "date";
  await ctx.reply(BOOKINT_TEXTS.askDate, cancelBookingKeyboard);
}

async function handleDate(ctx, userState) {
  userState.date = ctx.message.text;
  userState.step = "contacts";
  await ctx.reply(BOOKINT_TEXTS.askContacts, cancelBookingKeyboard);
}

async function completeBooking(ctx, userId, userState) {
  const { username, description, date, contacts, photo } = userState;
  const message = BOOKINT_TEXTS.masterMessage(
    username,
    description,
    date,
    contacts
  );

  if (photo) {
    await ctx.telegram.sendPhoto(process.env.MASTER_CHAT_ID, photo, {
      caption: message,
    });
  } else {
    await ctx.telegram.sendMessage(process.env.MASTER_CHAT_ID, message);
  }

  lastBookingTimestamps[userId] = Date.now();

  delete userStates[userId];
  await ctx.reply(BOOKINT_TEXTS.complete, mainMenuKeyboard);
}

async function cancelBooking(ctx, userId) {
  delete userStates[userId];
  await ctx.reply(BOOKINT_TEXTS.cancel, mainMenuKeyboard);
}

async function handleText(ctx) {
  const userId = ctx.from.id;
  const userState = userStates[userId];
  if (!userState) return;

  if (ctx.message.text === "Отменить запись") {
    return cancelBooking(ctx, userId);
  }

  switch (userState.step) {
    case "description":
      userState.description = ctx.message.text;
      userState.step = "photo";
      await ctx.reply(BOOKINT_TEXTS.askPhoto, bookingKeyboard);
      break;

    case "date":
      await handleDate(ctx, userState);
      break;

    case "contacts":
      userState.contacts = ctx.message.text;
      await completeBooking(ctx, userId, userState);
      break;
  }
}

async function handlePhotoMessage(ctx) {
  const userId = ctx.from.id;
  const userState = userStates[userId];
  if (userState?.step === "photo") {
    userState.photo = ctx.message.photo.pop().file_id;
    await handlePhoto(ctx, userState);
  }
}

export function setupBookingHandlers(bot) {
  bot.hears(["Запись на тату", "Запись на сеанс"], startBooking);
  bot.command("booking", startBooking);

  bot.hears("Продолжить без фото", async (ctx) => {
    const userState = userStates[ctx.from.id];
    if (userState?.step === "photo") await handlePhoto(ctx, userState);
  });

  bot.on("text", handleText);
  bot.on("photo", handlePhotoMessage);
}
