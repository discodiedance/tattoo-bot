import { bot } from "./bot/index.js";
import { runDb } from "./db/db.js";
import { createRateLimiter } from "./middleware/ratelimit.js";
import { setupSendNotificationHandler } from "./bot/handlers/notification.js";
import { setupMenuCommands } from "./bot/handlers/menu.js";
import { setupPortfolioHandlers } from "./bot/handlers/portfolio.js";
import { setupBookingHandlers } from "./bot/handlers/booking.js";
import { setupPriceHandlers } from "./bot/handlers/price.js";
import { setupContactsHandlers } from "./bot/handlers/contacts.js";
import { setupAftercareHandlers } from "./bot/handlers/aftercare.js";

bot.use(createRateLimiter(10, 10000));

setupMenuCommands(bot);
setupSendNotificationHandler(bot);
setupPriceHandlers(bot);
setupAftercareHandlers(bot);
setupContactsHandlers(bot);
setupPortfolioHandlers(bot);
setupBookingHandlers(bot);

bot.launch();

await runDb();

process.once("SIGINT", () => bot.stop("SIGINT"));
process.once("SIGTERM", () => bot.stop("SIGTERM"));
