import type { Bot } from "grammy";
import { env } from "../../config/env.js";
import type { BotContext } from "../context.js";
import { getWithdrawDaysLabel, t, type Locale } from "../i18n/index.js";
import { mainMenuKeyboard, onboardingMenuKeyboard } from "../keyboards.js";
import { completeOnboarding } from "../../services/wallet.service.js";
import { getDbUser } from "../helpers/locale-context.js";

function importantNotesText(locale: Locale): string {
  return t(locale, "importantNotes", {
    min: env.MIN_DEPOSIT,
    minWithdraw: env.MIN_WITHDRAW,
    profitRate: env.MONTHLY_PROFIT_RATE,
    withdrawDays: getWithdrawDaysLabel(),
  });
}

export async function showOnboardingMenu(
  ctx: BotContext,
  locale: Locale,
  name: string,
): Promise<void> {
  await ctx.reply(
    `${t(locale, "welcome", { name })}\n\n${t(locale, "onboardingMenuPrompt")}`,
    {
      parse_mode: "Markdown",
      reply_markup: onboardingMenuKeyboard(locale),
    },
  );
}

export async function finishOnboarding(ctx: BotContext, locale: Locale): Promise<void> {
  const dbUser = await getDbUser(ctx);
  if (!dbUser) return;

  await completeOnboarding(dbUser.id);

  try {
    await ctx.deleteMessage();
  } catch {
    // ignore
  }

  await ctx.reply(t(locale, "onboardingDone"), {
    reply_markup: mainMenuKeyboard(locale),
  });
}

function topicText(locale: Locale, topic: string): string | null {
  switch (topic) {
    case "about":
      return t(locale, "about");
    case "howItWorks":
      return t(locale, "howItWorks");
    case "importantNotes":
      return importantNotesText(locale);
    default:
      return null;
  }
}

export function registerOnboardingHandlers(bot: Bot<BotContext>): void {
  bot.callbackQuery(/^onboarding:(about|howItWorks|importantNotes)$/, async (ctx) => {
    // Callback query-ä derrew jogap berýäris (timeout ýalňyşlygynyň öňüni almak üçin)
    await ctx.answerCallbackQuery().catch(() => { });

    const { resolveContextLocale } = await import("../helpers/locale-context.js");
    const locale = await resolveContextLocale(ctx);
    const topic = ctx.match![1];
    const text = topicText(locale, topic);

    if (!text) return;

    await ctx.reply(text, {
      parse_mode: "Markdown",
      reply_markup: onboardingMenuKeyboard(locale),
    });
  });

  bot.callbackQuery("onboarding:complete", async (ctx) => {
    // Muňa hem derrew jogap berýäris
    await ctx.answerCallbackQuery().catch(() => { });

    const { resolveContextLocale } = await import("../helpers/locale-context.js");
    const locale = await resolveContextLocale(ctx);
    await finishOnboarding(ctx, locale);
  });
}

export async function ensureOnboardingComplete(ctx: BotContext): Promise<boolean> {
  const dbUser = await getDbUser(ctx);
  if (!dbUser) return false;

  if (dbUser.onboardingCompleted) return true;

  const locale =
    dbUser.language === "tr" || dbUser.language === "en" || dbUser.language === "ru"
      ? dbUser.language
      : "en";
  const name = ctx.from?.first_name ?? "User";

  await showOnboardingMenu(ctx, locale, name);
  return false;
}