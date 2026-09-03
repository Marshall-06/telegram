import type { Bot } from "grammy";
import { getAdminTelegramIds } from "../../config/env.js";
import { BusinessError } from "../../lib/errors.js";
import {
  cancelWithdrawal,
  completeWithdrawal,
  findWithdrawalByShortId,
  formatWithdrawalList,
  getPendingWithdrawals,
} from "../../services/withdrawal.service.js";
import { getUserLanguageByTelegramId } from "../../services/wallet.service.js";
import type { BotContext } from "../context.js";
import { resolveContextLocale } from "../helpers/locale-context.js";
import { t, translateError } from "../i18n/index.js";
import { formatAmount } from "../messages.js";

function isAdmin(telegramId: number): boolean {
  const admins = getAdminTelegramIds();
  return admins.length > 0 && admins.includes(telegramId);
}

function formatBusinessError(locale: Awaited<ReturnType<typeof resolveContextLocale>>, error: unknown): string {
  if (error instanceof BusinessError) {
    return translateError(locale, error.code, error.params);
  }
  if (error instanceof Error) return error.message;
  return translateError(locale, "UNKNOWN");
}

export async function showAdminPanel(ctx: BotContext): Promise<void> {
  const user = ctx.from;
  const locale = await resolveContextLocale(ctx);
  if (!user || !isAdmin(user.id)) {
    await ctx.reply(t(locale, "adminOnly"));
    return;
  }

  const botInfo = await ctx.api.getMe();
  await ctx.reply(
    t(locale, "adminPanel", { botUsername: botInfo.username ?? "Vanguard5_bot" }),
    { parse_mode: "Markdown" },
  );
}

export function registerAdminCommands(bot: Bot<BotContext>): void {
  bot.command("admin", async (ctx) => {
    await showAdminPanel(ctx);
  });

  bot.command("admin_cekimler", async (ctx) => {
    const user = ctx.from;
    const locale = await resolveContextLocale(ctx);
    if (!user || !isAdmin(user.id)) {
      await ctx.reply(t(locale, "adminOnly"));
      return;
    }

    const pending = await getPendingWithdrawals();
    await ctx.reply(formatWithdrawalList(pending, locale), { parse_mode: "Markdown" });
  });

  bot.command("admin_cekim_tamam", async (ctx) => {
    const user = ctx.from;
    const locale = await resolveContextLocale(ctx);
    if (!user || !isAdmin(user.id)) {
      await ctx.reply(t(locale, "adminOnly"));
      return;
    }

    const idArg = ctx.message?.text?.split(/\s+/)[1];
    if (!idArg) {
      await ctx.reply(t(locale, "adminUsageComplete"));
      return;
    }

    const withdrawal = await findWithdrawalByShortId(idArg);
    if (!withdrawal) {
      await ctx.reply(t(locale, "adminWithdrawNotFound"));
      return;
    }

    try {
      const completed = await completeWithdrawal(withdrawal.id);
      const displayName =
        completed.user.username ??
        [completed.user.firstName, completed.user.lastName].filter(Boolean).join(" ") ??
        completed.user.telegramId.toString();

      await ctx.reply(
        t(locale, "adminWithdrawCompleted", {
          id: withdrawal.id.slice(-8),
          amount: formatAmount(completed.amount),
          user: displayName,
        }),
      );

      const userLocale = await getUserLanguageByTelegramId(completed.user.telegramId);
      try {
        await ctx.api.sendMessage(
          Number(completed.user.telegramId),
          t(userLocale, "withdrawCompletedUser", {
            amount: formatAmount(completed.amount),
          }),
        );
      } catch {
        // ignore
      }
    } catch (error) {
      await ctx.reply(t(locale, "error", { error: formatBusinessError(locale, error) }));
    }
  });

  bot.command("admin_cekim_iptal", async (ctx) => {
    const user = ctx.from;
    const locale = await resolveContextLocale(ctx);
    if (!user || !isAdmin(user.id)) {
      await ctx.reply(t(locale, "adminOnly"));
      return;
    }

    const idArg = ctx.message?.text?.split(/\s+/)[1];
    if (!idArg) {
      await ctx.reply(t(locale, "adminUsageCancel"));
      return;
    }

    const withdrawal = await findWithdrawalByShortId(idArg);
    if (!withdrawal) {
      await ctx.reply(t(locale, "adminWithdrawNotFound"));
      return;
    }

    try {
      const cancelled = await cancelWithdrawal(withdrawal.id);
      const displayName =
        cancelled.user.username ??
        [cancelled.user.firstName, cancelled.user.lastName].filter(Boolean).join(" ") ??
        cancelled.user.telegramId.toString();

      await ctx.reply(
        t(locale, "adminWithdrawCancelled", {
          id: withdrawal.id.slice(-8),
          amount: formatAmount(cancelled.amount),
          user: displayName,
        }),
      );

      const userLocale = await getUserLanguageByTelegramId(cancelled.user.telegramId);
      try {
        await ctx.api.sendMessage(
          Number(cancelled.user.telegramId),
          t(userLocale, "withdrawCancelledUser", {
            amount: formatAmount(cancelled.amount),
          }),
        );
      } catch {
        // ignore
      }
    } catch (error) {
      await ctx.reply(t(locale, "error", { error: formatBusinessError(locale, error) }));
    }
  });
}

export async function notifyAdminsPendingWithdrawals(bot: Bot<BotContext>): Promise<void> {
  const admins = getAdminTelegramIds();
  if (admins.length === 0) return;

  const pending = await getPendingWithdrawals();
  if (pending.length === 0) return;

  for (const adminId of admins) {
    const locale = await getUserLanguageByTelegramId(BigInt(adminId));
    const text = formatWithdrawalList(pending, locale);
    try {
      await bot.api.sendMessage(adminId, text, { parse_mode: "Markdown" });
    } catch {
      // ignore
    }
  }
}
