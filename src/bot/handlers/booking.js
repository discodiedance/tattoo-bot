import { MASTER_CHAT_ID, MASTER_LOGIN } from "../../../config.js";
import { BOOKINT_TEXTS } from "../common/texts.js";
import {
  bookingKeyboard,
  mainMenuKeyboard,
  cancelBookingKeyboard,
} from "../utils/keyboards.js";

const userStates = {};
const lastBookingTimestamps = {};
const TIMEOUT_MS = 5 * 60 * 1000;
const userTimers = {};

function canUserBook(userId) {
  const lastBooking = lastBookingTimestamps[userId];
  if (!lastBooking) return true;

  const oneDay = 24 * 60 * 60 * 1000;
  return Date.now() - lastBooking >= oneDay;
}

function setupUserTimeout(userId) {
  if (userTimers[userId]) {
    clearTimeout(userTimers[userId]);
  }

  userTimers[userId] = setTimeout(async () => {
    if (userStates[userId]) {
      delete userStates[userId];
      const botInstance = getBotInstance();
      await botInstance.telegram.sendMessage(
        userId,
        "⏳ Время записи истекло. Пожалуйста, начните заново.",
        mainMenuKeyboard
      );
    }
    delete userTimers[userId];
  }, TIMEOUT_MS);
}

async function startBooking(ctx) {
  const user = ctx.from;

  if (!canUserBook(user.id)) {
    return ctx.reply(
      `Вы уже делали запись сегодня. Пожалуйста, попробуйте завтра. Либо свяжитесь с мастером: ${MASTER_LOGIN}`,
      mainMenuKeyboard
    );
  }

  userStates[ctx.from.id] = {
    step: "description",
    username: user.username
      ? `@${user.username}`
      : `${user.first_name}${user.last_name ? ` ${user.last_name}` : ""}`,
  };

  setupUserTimeout(ctx.from.id);
  await ctx.reply(BOOKINT_TEXTS.start, cancelBookingKeyboard);
}

async function handlePhoto(ctx, userState) {
  const userId = ctx.from.id;
  userState.step = "date";
  setupUserTimeout(userId);
  await ctx.reply(BOOKINT_TEXTS.askDate, cancelBookingKeyboard);
}

async function handleDate(ctx, userState) {
  const userId = ctx.from.id;
  userState.date = ctx.message.text;
  userState.step = "contacts";
  setupUserTimeout(userId);
  await ctx.reply(BOOKINT_TEXTS.askContacts, cancelBookingKeyboard);
}

async function completeBooking(ctx, userId, userState) {
  if (userTimers[userId]) {
    clearTimeout(userTimers[userId]);
    delete userTimers[userId];
  }

  const { username, description, date, contacts, photo } = userState;
  const message = BOOKINT_TEXTS.masterMessage(
    username,
    description,
    date,
    contacts
  );

  if (photo) {
    await ctx.telegram.sendPhoto(MASTER_CHAT_ID, photo, {
      caption: message,
    });
  } else {
    await ctx.telegram.sendMessage(MASTER_CHAT_ID, message);
  }

  lastBookingTimestamps[userId] = Date.now();
  delete userStates[userId];
  await ctx.reply(BOOKINT_TEXTS.complete, mainMenuKeyboard);
}

async function cancelBooking(ctx, userId) {
  if (userTimers[userId]) {
    clearTimeout(userTimers[userId]);
    delete userTimers[userId];
  }

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
      setupUserTimeout(userId);
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
  global.botInstance = bot;

  bot.hears(["Запись на тату", "Запись на сеанс"], startBooking);
  bot.command("booking", startBooking);

  bot.hears("Продолжить без фото", async (ctx) => {
    const userState = userStates[ctx.from.id];
    if (userState?.step === "photo") await handlePhoto(ctx, userState);
  });

  bot.on("text", handleText);
  bot.on("photo", handlePhotoMessage);
}

function getBotInstance() {
  return global.botInstance;
}
