import { Bot, session } from "grammy";
import { HttpsProxyAgent } from "https-proxy-agent";
import { env } from "../config/env.js";
import { logger } from "../lib/logger.js";
import { getTelegramNetworkHelp } from "../lib/telegram-network.js";
import type { BotContext } from "./context.js";
import {
  registerCommands,
  setupBotCommands,
} from "./commands/index.js";

let activeBot: Bot<BotContext> | null = null;

function getBotOptions() {
  if (!env.TELEGRAM_PROXY) return undefined;

  logger.info({ proxy: env.TELEGRAM_PROXY }, "Telegram proxy aktif");
  return {
    client: {
      baseFetchConfig: {
        agent: new HttpsProxyAgent(env.TELEGRAM_PROXY),
      },
    },
  };
}

export function createBot(): Bot<BotContext> {
  const bot = new Bot<BotContext>(env.BOT_TOKEN, getBotOptions());

  bot.use(
    session({
      initial: (): BotContext["session"] => ({}),
    }),
  );

  registerCommands(bot);

  bot.catch((err) => {
    logger.error({ err: err.error }, "Bot hatasi");
  });

  return bot;
}

export async function stopBot(): Promise<void> {
  if (!activeBot) return;

  try {
    await activeBot.stop();
    logger.info("Bot durduruldu");
  } catch (error) {
    logger.warn({ error }, "Bot durdurulurken hata");
  } finally {
    activeBot = null;
  }
}

export async function startBot(): Promise<Bot<BotContext>> {
  await stopBot();

  const bot = createBot();

  try {
    await bot.api.deleteWebhook({ drop_pending_updates: false });
  } catch (error) {
    logger.warn({ error }, "Webhook temizlenemedi");
  }

  try {
    await setupBotCommands(bot);
  } catch (error) {
    logger.warn(
      { error: getTelegramNetworkHelp(error) },
      "Komut menusu kaydedilemedi, bot yine de baslatiliyor",
    );
  }

  activeBot = bot;

  try {
    await bot.start({
      onStart: (info) => logger.info({ username: info.username }, "Bot baslatildi"),
    });
  } catch (error) {
    activeBot = null;
    throw new Error(getTelegramNetworkHelp(error));
  }

  return bot;
}
