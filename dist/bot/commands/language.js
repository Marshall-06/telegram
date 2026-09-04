import { parseLocale, t } from "../i18n/index.js";
import { languageInlineKeyboard, mainMenuKeyboard } from "../keyboards.js";
import { getDbUser } from "../helpers/locale-context.js";
import { setUserLanguage } from "../../services/wallet.service.js";
import { clearFlow } from "../flows/session.js";
import { showOnboardingMenu } from "../flows/onboarding.js";
export async function promptStartLanguageSelection(ctx, name) {
    await ctx.reply(t("en", "startLanguageSelect", { name }), {
        reply_markup: languageInlineKeyboard(),
    });
}
export async function promptLanguageSelection(ctx) {
    await ctx.reply(t("en", "languagePrompt"), {
        reply_markup: languageInlineKeyboard(),
    });
}
export async function applyLanguage(ctx, locale) {
    const dbUser = await getDbUser(ctx);
    if (!dbUser)
        return;
    const wasOnboarded = dbUser.onboardingCompleted;
    await setUserLanguage(dbUser.id, locale);
    clearFlow(ctx.session);
    await ctx.reply(t(locale, "languageChanged"));
    try {
        await ctx.deleteMessage();
    }
    catch {
        // ignore
    }
    const name = ctx.from?.first_name ?? "User";
    if (wasOnboarded) {
        await ctx.reply(t(locale, "welcome", { name }), {
            reply_markup: mainMenuKeyboard(locale),
        });
        return;
    }
    await showOnboardingMenu(ctx, locale, name);
}
export function registerLanguageHandlers(bot) {
    bot.command("language", async (ctx) => {
        await promptLanguageSelection(ctx);
    });
    bot.callbackQuery(/^lang:(tr|en|ru)$/, async (ctx) => {
        const locale = parseLocale(ctx.match[1]);
        if (!locale) {
            await ctx.answerCallbackQuery();
            return;
        }
        await ctx.answerCallbackQuery();
        await applyLanguage(ctx, locale);
    });
}
export async function ensureLanguageSelected(ctx) {
    const dbUser = await getDbUser(ctx);
    if (!dbUser)
        return false;
    if (dbUser.languageConfirmed)
        return true;
    await promptStartLanguageSelection(ctx, ctx.from?.first_name ?? "User");
    return false;
}
//# sourceMappingURL=language.js.map