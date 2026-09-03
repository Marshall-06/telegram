import { env } from "../../config/env.js";
import { detectLocale as detectLocaleFromLib } from "../../lib/locale.js";
import { formatWithdrawDays, parseWithdrawDays } from "../../lib/withdraw-schedule.js";
import { en } from "./locales/en.js";
import { ru } from "./locales/ru.js";
import { tr } from "./locales/tr.js";
import type {
  LedgerTypeKey,
  Locale,
  LocalePack,
  MenuAction,
  TranslateParams,
  TranslationKey,
} from "./types.js";
import { LOCALES } from "./types.js";

const packs: Record<Locale, LocalePack> = { tr, en, ru };

export function getLocalePack(locale: Locale): LocalePack {
  return packs[locale];
}

export function t(locale: Locale, key: TranslationKey, params?: TranslateParams): string {
  return getLocalePack(locale).t(key, params);
}

export function translateError(locale: Locale, code: string, params?: TranslateParams): string {
  const pack = getLocalePack(locale);
  const template = pack.errors[code as keyof typeof pack.errors];
  if (!template) return pack.errors.UNKNOWN;
  const merged: TranslateParams = {
    currency: env.DEFAULT_CURRENCY,
    ...params,
  };
  return template.replace(/\{(\w+)\}/g, (_, key: string) => {
    const value = merged[key as keyof TranslateParams];
    return value !== undefined ? String(value) : `{${key}}`;
  });
}

export function getWithdrawDaysLabel(): string {
  return formatWithdrawDays(parseWithdrawDays(env.WITHDRAW_DAYS));
}

export function detectLocale(languageCode?: string): Locale {
  return detectLocaleFromLib(languageCode);
}

export function parseLocale(value: string): Locale | null {
  if (LOCALES.includes(value as Locale)) return value as Locale;
  return null;
}

export function getMenuLabel(locale: Locale, action: MenuAction): string {
  return getLocalePack(locale).menu[action];
}

export function resolveMenuAction(text: string): MenuAction | null {
  for (const locale of LOCALES) {
    const menu = getLocalePack(locale).menu;
    for (const [action, label] of Object.entries(menu) as [MenuAction, string][]) {
      if (label === text) return action;
    }
  }
  return null;
}

export function getLedgerTypeLabel(locale: Locale, type: string): string {
  const key = type as LedgerTypeKey;
  return getLocalePack(locale).ledgerTypes[key] ?? type;
}

export function formatDate(locale: Locale, date: Date): string {
  const localeTag = locale === "tr" ? "tr-TR" : locale === "ru" ? "ru-RU" : "en-US";
  return date.toLocaleDateString(localeTag);
}

export { LOCALES };
export type { Locale, MenuAction, TranslationKey, TranslateParams };
