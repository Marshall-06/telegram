import type { Locale } from "../bot/i18n/types.js";

export function detectLocale(languageCode?: string): Locale {
  if (!languageCode) return "en";
  const code = languageCode.toLowerCase();
  if (code.startsWith("tr")) return "tr";
  if (code.startsWith("ru")) return "ru";
  return "en";
}
