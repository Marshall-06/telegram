import { env } from "../../config/env.js";
import { detectLocale as detectLocaleFromLib } from "../../lib/locale.js";
import { formatWithdrawDays, parseWithdrawDays } from "../../lib/withdraw-schedule.js";
import { en } from "./locales/en.js";
import { ru } from "./locales/ru.js";
import { tr } from "./locales/tr.js";
import { LOCALES } from "./types.js";
const packs = { tr, en, ru };
export function getLocalePack(locale) {
    return packs[locale];
}
export function t(locale, key, params) {
    return getLocalePack(locale).t(key, params);
}
export function translateError(locale, code, params) {
    const pack = getLocalePack(locale);
    const template = pack.errors[code];
    if (!template)
        return pack.errors.UNKNOWN;
    const merged = {
        currency: env.DEFAULT_CURRENCY,
        ...params,
    };
    return template.replace(/\{(\w+)\}/g, (_, key) => {
        const value = merged[key];
        return value !== undefined ? String(value) : `{${key}}`;
    });
}
export function getWithdrawDaysLabel() {
    return formatWithdrawDays(parseWithdrawDays(env.WITHDRAW_DAYS));
}
export function detectLocale(languageCode) {
    return detectLocaleFromLib(languageCode);
}
export function parseLocale(value) {
    if (LOCALES.includes(value))
        return value;
    return null;
}
export function getMenuLabel(locale, action) {
    return getLocalePack(locale).menu[action];
}
export function resolveMenuAction(text) {
    for (const locale of LOCALES) {
        const menu = getLocalePack(locale).menu;
        for (const [action, label] of Object.entries(menu)) {
            if (label === text)
                return action;
        }
    }
    return null;
}
export function getLedgerTypeLabel(locale, type) {
    const key = type;
    return getLocalePack(locale).ledgerTypes[key] ?? type;
}
export function formatDate(locale, date) {
    const localeTag = locale === "tr" ? "tr-TR" : locale === "ru" ? "ru-RU" : "en-US";
    return date.toLocaleDateString(localeTag);
}
export { LOCALES };
//# sourceMappingURL=index.js.map