import { env } from "../../config/env.js";
import { prisma } from "../../db/client.js";
import { BusinessError } from "../../lib/errors.js";
import { createDepositRequest } from "../../services/investment.service.js";
import { createWithdrawalRequest, getAvailableBalance, } from "../../services/withdrawal.service.js";
import { findOrCreateUser, getBalance, } from "../../services/wallet.service.js";
import { clearFlow, parseAmount, startFlow } from "../flows/session.js";
import { getDbUser, getUserLocale, resolveContextLocale, } from "../helpers/locale-context.js";
import { cancelMenuKeyboard, languageInlineKeyboard, mainMenuKeyboard, } from "../keyboards.js";
import { formatDate, getLedgerTypeLabel, getWithdrawDaysLabel, resolveMenuAction, t, translateError, } from "../i18n/index.js";
import { formatAmount, isValidTrustWalletAddress, normalizeTrustWalletAddress, } from "../messages.js";
import { registerAdminCommands, showAdminPanel } from "./admin.js";
import { ensureLanguageSelected, promptStartLanguageSelection, registerLanguageHandlers, } from "./language.js";
import { ensureOnboardingComplete, registerOnboardingHandlers } from "../flows/onboarding.js";
function formatBusinessError(locale, error) {
    if (error instanceof BusinessError) {
        return translateError(locale, error.code, error.params);
    }
    if (error instanceof Error)
        return error.message;
    return translateError(locale, "UNKNOWN");
}
async function ensureUserReady(ctx) {
    if (!(await ensureLanguageSelected(ctx)))
        return false;
    if (!(await ensureOnboardingComplete(ctx)))
        return false;
    return true;
}
export function registerCommands(bot) {
    registerAdminCommands(bot);
    registerLanguageHandlers(bot);
    registerOnboardingHandlers(bot);
    bot.command("start", async (ctx) => {
        if (!ctx.from)
            return;
        const dbUser = await findOrCreateUser(ctx.from);
        const payload = ctx.match?.trim();
        if (payload === "admin") {
            await showAdminPanel(ctx);
            return;
        }
        if (!dbUser.languageConfirmed) {
            await promptStartLanguageSelection(ctx, ctx.from.first_name ?? "User");
            return;
        }
        if (!dbUser.onboardingCompleted) {
            await ensureOnboardingComplete(ctx);
            return;
        }
        const locale = getUserLocale(dbUser, ctx.from.language_code);
        await ctx.reply(t(locale, "welcome", { name: ctx.from.first_name ?? "User" }), {
            reply_markup: mainMenuKeyboard(locale),
        });
    });
    bot.command("about", async (ctx) => {
        if (!(await ensureUserReady(ctx)))
            return;
        const locale = await resolveContextLocale(ctx);
        await ctx.reply(t(locale, "about"), { parse_mode: "Markdown" });
    });
    bot.command("help", async (ctx) => {
        if (!(await ensureUserReady(ctx)))
            return;
        const locale = await resolveContextLocale(ctx);
        await ctx.reply(t(locale, "help"), { parse_mode: "Markdown" });
    });
    bot.command("balance", handleBalance);
    bot.command("deposit", startDeposit);
    bot.command("withdraw", startWithdraw);
    bot.command("history", handleHistory);
    bot.command("cancel", async (ctx) => {
        const locale = await resolveContextLocale(ctx);
        clearFlow(ctx.session);
        await ctx.reply(t(locale, "cancelled"), { reply_markup: mainMenuKeyboard(locale) });
    });
    bot.on("message:text", async (ctx, next) => {
        const action = resolveMenuAction(ctx.message.text);
        if (action) {
            if (!(await ensureUserReady(ctx)))
                return;
            switch (action) {
                case "balance":
                    await handleBalance(ctx);
                    return;
                case "deposit":
                    await startDeposit(ctx);
                    return;
                case "withdraw":
                    await startWithdraw(ctx);
                    return;
                case "history":
                    await handleHistory(ctx);
                    return;
                case "about":
                    await ctx.reply(t(await resolveContextLocale(ctx), "about"), {
                        parse_mode: "Markdown",
                    });
                    return;
                case "help":
                    await ctx.reply(t(await resolveContextLocale(ctx), "help"), {
                        parse_mode: "Markdown",
                    });
                    return;
                case "language":
                    await ctx.reply(t(await resolveContextLocale(ctx), "languagePrompt"), {
                        reply_markup: languageInlineKeyboard(),
                    });
                    return;
                case "cancel":
                    clearFlow(ctx.session);
                    await ctx.reply(t(await resolveContextLocale(ctx), "cancelled"), {
                        reply_markup: mainMenuKeyboard(await resolveContextLocale(ctx)),
                    });
                    return;
            }
        }
        if (!ctx.session.awaiting) {
            return next();
        }
        await handleFlowInput(ctx);
    });
}
async function handleFlowInput(ctx) {
    const locale = await resolveContextLocale(ctx);
    const dbUser = await getDbUser(ctx);
    const text = ctx.message?.text;
    if (!dbUser || !ctx.from || !text)
        return;
    if (ctx.session.awaiting === "withdraw_wallet") {
        const wallet = normalizeTrustWalletAddress(text);
        if (!isValidTrustWalletAddress(wallet)) {
            await ctx.reply(t(locale, "invalidWallet"));
            return;
        }
        ctx.session.trustWallet = wallet;
        ctx.session.awaiting = "withdraw_amount";
        await ctx.reply(t(locale, "withdrawAmountPrompt", {
            min: env.MIN_WITHDRAW,
            withdrawDays: getWithdrawDaysLabel(),
        }), { reply_markup: cancelMenuKeyboard(locale) });
        return;
    }
    const amount = parseAmount(text);
    if (amount === null) {
        await ctx.reply(t(locale, "invalidAmount"));
        return;
    }
    try {
        if (ctx.session.awaiting === "deposit") {
            if (!env.MASTER_TRUST_WALLET) {
                await ctx.reply(t(locale, "depositNoMasterWallet"), {
                    reply_markup: mainMenuKeyboard(locale),
                });
            }
            else {
                const deposit = await createDepositRequest(dbUser.id, amount);
                await ctx.reply(t(locale, "depositCreated", {
                    amount: formatAmount(deposit.amount),
                    reference: deposit.reference,
                    masterWallet: env.MASTER_TRUST_WALLET,
                }), { parse_mode: "Markdown", reply_markup: mainMenuKeyboard(locale) });
            }
        }
        else if (ctx.session.awaiting === "withdraw_amount") {
            const wallet = ctx.session.trustWallet ?? dbUser.trustWallet;
            if (!wallet) {
                await ctx.reply(t(locale, "invalidWallet"));
                return;
            }
            const withdrawal = await createWithdrawalRequest(dbUser.id, amount, wallet);
            await ctx.reply(t(locale, "withdrawCreated", {
                amount: formatAmount(withdrawal.amount),
                scheduledFor: withdrawal.scheduledFor
                    ? formatDate(locale, withdrawal.scheduledFor)
                    : "-",
            }), { parse_mode: "Markdown", reply_markup: mainMenuKeyboard(locale) });
        }
    }
    catch (error) {
        await ctx.reply(t(locale, "error", { error: formatBusinessError(locale, error) }));
        return;
    }
    clearFlow(ctx.session);
}
async function handleBalance(ctx) {
    if (!(await ensureUserReady(ctx)))
        return;
    const locale = await resolveContextLocale(ctx);
    const dbUser = await getDbUser(ctx);
    if (!dbUser)
        return;
    const balance = await getBalance(dbUser.id);
    const available = await getAvailableBalance(dbUser.id);
    await ctx.reply(t(locale, "balance", {
        amount: formatAmount(balance),
        available: formatAmount(available),
    }), { parse_mode: "Markdown" });
}
async function startDeposit(ctx) {
    if (!(await ensureUserReady(ctx)))
        return;
    const locale = await resolveContextLocale(ctx);
    startFlow(ctx.session, "deposit");
    await ctx.reply(t(locale, "depositPrompt", { min: env.MIN_DEPOSIT }), {
        reply_markup: cancelMenuKeyboard(locale),
    });
}
async function startWithdraw(ctx) {
    if (!(await ensureUserReady(ctx)))
        return;
    const locale = await resolveContextLocale(ctx);
    const dbUser = await getDbUser(ctx);
    if (!dbUser)
        return;
    if (dbUser.trustWallet) {
        ctx.session.trustWallet = dbUser.trustWallet;
        startFlow(ctx.session, "withdraw_amount");
        await ctx.reply(t(locale, "withdrawAmountPrompt", {
            min: env.MIN_WITHDRAW,
            withdrawDays: getWithdrawDaysLabel(),
        }), { reply_markup: cancelMenuKeyboard(locale) });
        return;
    }
    startFlow(ctx.session, "withdraw_wallet");
    await ctx.reply(t(locale, "withdrawWalletPrompt"), {
        reply_markup: cancelMenuKeyboard(locale),
    });
}
async function handleHistory(ctx) {
    if (!(await ensureUserReady(ctx)))
        return;
    const locale = await resolveContextLocale(ctx);
    const dbUser = await getDbUser(ctx);
    if (!dbUser)
        return;
    const entries = await prisma.ledgerEntry.findMany({
        where: { userId: dbUser.id },
        orderBy: { createdAt: "desc" },
        take: 10,
    });
    if (entries.length === 0) {
        await ctx.reply(t(locale, "historyEmpty"));
        return;
    }
    const lines = entries.map((e) => t(locale, "historyLine", {
        type: getLedgerTypeLabel(locale, e.type),
        amount: formatAmount(e.amount),
        balanceAfter: formatAmount(e.balanceAfter),
        date: formatDate(locale, e.createdAt),
    }));
    await ctx.reply(`${t(locale, "historyHeader")}\n${lines.join("\n")}`, {
        parse_mode: "Markdown",
    });
}
const commandDescriptions = {
    tr: [
        { command: "start", description: "Hos geldin" },
        { command: "about", description: "Proje tanitimi" },
        { command: "balance", description: "Bakiye" },
        { command: "deposit", description: "Yatirim" },
        { command: "withdraw", description: "Cekim" },
        { command: "history", description: "Gecmis" },
        { command: "language", description: "Dil secimi" },
        { command: "help", description: "Yardim" },
        { command: "cancel", description: "Iptal" },
    ],
    en: [
        { command: "start", description: "Welcome" },
        { command: "about", description: "About project" },
        { command: "balance", description: "Balance" },
        { command: "deposit", description: "Deposit" },
        { command: "withdraw", description: "Withdraw" },
        { command: "history", description: "History" },
        { command: "language", description: "Language" },
        { command: "help", description: "Help" },
        { command: "cancel", description: "Cancel" },
    ],
    ru: [
        { command: "start", description: "Приветствие" },
        { command: "about", description: "О проекте" },
        { command: "balance", description: "Баланс" },
        { command: "deposit", description: "Депозит" },
        { command: "withdraw", description: "Вывод" },
        { command: "history", description: "История" },
        { command: "language", description: "Язык" },
        { command: "help", description: "Помощь" },
        { command: "cancel", description: "Отмена" },
    ],
};
export async function setupBotCommands(bot) {
    await bot.api.setMyCommands(commandDescriptions.en);
    await bot.api.setMyCommands(commandDescriptions.tr, { language_code: "tr" });
    await bot.api.setMyCommands(commandDescriptions.ru, { language_code: "ru" });
}
//# sourceMappingURL=index.js.map