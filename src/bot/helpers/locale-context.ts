import type { User } from "@prisma/client";
import type { BotContext } from "../context.js";
import { detectLocale, type Locale } from "../i18n/index.js";
import { findOrCreateUser } from "../../services/wallet.service.js";

export async function getDbUser(ctx: BotContext) {
  const from = ctx.from;
  if (!from) return null;
  return findOrCreateUser(from);
}

export function getUserLocale(user: User | null | undefined, fallbackCode?: string): Locale {
  if (user?.language === "tr" || user?.language === "en" || user?.language === "ru") {
    return user.language;
  }
  return detectLocale(fallbackCode);
}

export async function resolveContextLocale(ctx: BotContext): Promise<Locale> {
  const user = await getDbUser(ctx);
  return getUserLocale(user, ctx.from?.language_code);
}
