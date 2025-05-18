import { rateLimits } from "../bot/utils/rate-limit-store.js";

export function createRateLimiter(limit = 10, windowMs = 5000) {
  return async (ctx, next) => {
    if (!ctx.updateType || !ctx.from) return next();

    const userId = ctx.from.id;
    const now = Date.now();
    const userData = rateLimits.get(userId) || { count: 0, lastReset: now };

    if (now - userData.lastReset > windowMs) {
      userData.count = 0;
      userData.lastReset = now;
    }

    if (userData.count >= limit) {
      const waitTime = Math.ceil((userData.lastReset + windowMs - now) / 1000);
      try {
        await ctx.reply(
          `⏳ Подождите ${waitTime} сек перед следующим запросом.`
        );
      } catch (e) {
        console.error("Rate limit reply error:", e);
      }
      return;
    }

    userData.count++;
    rateLimits.set(userId, userData);

    return next();
  };
}
