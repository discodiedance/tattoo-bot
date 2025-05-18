export const rateLimits = new Map();

setInterval(() => {
  const now = Date.now();
  for (const [userId, data] of rateLimits.entries()) {
    if (now - data.lastReset > 600000) {
      rateLimits.delete(userId);
    }
  }
}, 600000);
