import { InlineKeyboard, Keyboard } from "grammy";
import type { Locale, MenuAction } from "./i18n/types.js";
import { getMenuLabel, LOCALES, t } from "./i18n/index.js";

export function mainMenuKeyboard(locale: Locale): Keyboard {
  return new Keyboard()
    .text(getMenuLabel(locale, "balance"))
    .text(getMenuLabel(locale, "deposit"))
    .row()
    .text(getMenuLabel(locale, "withdraw"))
    .text(getMenuLabel(locale, "history"))
    .row()
    .text(getMenuLabel(locale, "about"))
    .text(getMenuLabel(locale, "help"))
    .row()
    .text(getMenuLabel(locale, "language"))
    .resized()
    .persistent();
}

export function cancelMenuKeyboard(locale: Locale): Keyboard {
  return new Keyboard()
    .text(getMenuLabel(locale, "cancel"))
    .resized()
    .oneTime();
}

export const LANGUAGE_OPTIONS = [
  { locale: "tr" as const, label: "🇹🇷 Türkçe", callback: "lang:tr" },
  { locale: "en" as const, label: "🇬🇧 English", callback: "lang:en" },
  { locale: "ru" as const, label: "🇷🇺 Русский", callback: "lang:ru" },
] as const;

export function languageInlineKeyboard(): InlineKeyboard {
  const keyboard = new InlineKeyboard();
  LANGUAGE_OPTIONS.forEach((option, index) => {
    if (index > 0) keyboard.row();
    keyboard.text(option.label, option.callback);
  });
  return keyboard;
}

export function onboardingMenuKeyboard(locale: Locale): InlineKeyboard {
  return new InlineKeyboard()
    .text(t(locale, "onboardingBtnAbout"), "onboarding:about")
    .row()
    .text(t(locale, "onboardingBtnHow"), "onboarding:howItWorks")
    .row()
    .text(t(locale, "onboardingBtnNotes"), "onboarding:importantNotes")
    .row()
    .text(t(locale, "onboardingConfirm"), "onboarding:complete");
}

export function allMenuLabels(): string[] {
  const labels: string[] = [];
  for (const locale of LOCALES) {
    for (const action of [
      "balance",
      "deposit",
      "withdraw",
      "history",
      "about",
      "help",
      "language",
      "cancel",
    ] as MenuAction[]) {
      labels.push(getMenuLabel(locale, action));
    }
  }
  return labels;
}
