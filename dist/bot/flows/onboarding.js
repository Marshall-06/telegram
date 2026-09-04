import { env } from "../../config/env.js";
import { getWithdrawDaysLabel, t } from "../i18n/index.js";
import { mainMenuKeyboard, onboardingMenuKeyboard } from "../keyboards.js";
import { completeOnboarding } from "../../services/wallet.service.js";
import { getDbUser } from "../helpers/locale-context.js";
function importantNotesText(locale) {
    return t(locale, "importantNotes", {
        min: env.MIN_DEPOSIT,
        minWithdraw: env.MIN_WITHDRAW,
        profitRate: env.MONTHLY_PROFIT_RATE,
        withdrawDays: getWithdrawDaysLabel(),
    });
}
export async function showOnboardingMenu(ctx, locale, name) {
    await ctx.reply(`${t(locale, "welcome", { name })}\n\n${t(locale, "onboardingMenuPrompt")}`, {
        parse_mode: "Markdown",
        reply_markup: onboardingMenuKeyboard(locale),
    });
}
export async function finishOnboarding(ctx, locale) {
    const dbUser = await getDbUser(ctx);
    if (!dbUser)
        return;
    await completeOnboarding(dbUser.id);
    try {
        await ctx.deleteMessage();
    }
    catch {
        // ignore
    }
    await ctx.reply(t(locale, "onboardingDone"), {
        reply_markup: mainMenuKeyboard(locale),
    });
}
function topicText(locale, topic) {
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
export function registerOnboardingHandlers(bot) {
    bot.callbackQuery(/^onboarding:(about|howItWorks|importantNotes)$/, async (ctx) => {
        const { resolveContextLocale } = await import("../helpers/locale-context.js");
        const locale = await resolveContextLocale(ctx);
        const topic = ctx.match[1];
        const text = topicText(locale, topic);
        await ctx.answerCallbackQuery();
        if (!text)
            return;
        await ctx.reply(text, {
            parse_mode: "Markdown",
            reply_markup: onboardingMenuKeyboard(locale),
        });
    });
    bot.callbackQuery("onboarding:complete", async (ctx) => {
        const { resolveContextLocale } = await import("../helpers/locale-context.js");
        const locale = await resolveContextLocale(ctx);
        await ctx.answerCallbackQuery();
        await finishOnboarding(ctx, locale);
    });
}
export async function ensureOnboardingComplete(ctx) {
    const dbUser = await getDbUser(ctx);
    if (!dbUser)
        return false;
    if (dbUser.onboardingCompleted)
        return true;
    const locale = dbUser.language === "tr" || dbUser.language === "en" || dbUser.language === "ru"
        ? dbUser.language
        : "en";
    const name = ctx.from?.first_name ?? "User";
    await showOnboardingMenu(ctx, locale, name);
    return false;
}
//# sourceMappingURL=onboarding.js.map