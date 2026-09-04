import { InlineKeyboard, Keyboard } from "grammy";
import type { Locale } from "./i18n/types.js";
export declare function mainMenuKeyboard(locale: Locale): Keyboard;
export declare function cancelMenuKeyboard(locale: Locale): Keyboard;
export declare const LANGUAGE_OPTIONS: readonly [{
    readonly locale: "tr";
    readonly label: "🇹🇷 Türkçe";
    readonly callback: "lang:tr";
}, {
    readonly locale: "en";
    readonly label: "🇬🇧 English";
    readonly callback: "lang:en";
}, {
    readonly locale: "ru";
    readonly label: "🇷🇺 Русский";
    readonly callback: "lang:ru";
}];
export declare function languageInlineKeyboard(): InlineKeyboard;
export declare function onboardingMenuKeyboard(locale: Locale): InlineKeyboard;
export declare function allMenuLabels(): string[];
