import type { Bot } from "grammy";
import type { BotContext } from "../context.js";
import { type Locale } from "../i18n/index.js";
export declare function promptStartLanguageSelection(ctx: BotContext, name: string): Promise<void>;
export declare function promptLanguageSelection(ctx: BotContext): Promise<void>;
export declare function applyLanguage(ctx: BotContext, locale: Locale): Promise<void>;
export declare function registerLanguageHandlers(bot: Bot<BotContext>): void;
export declare function ensureLanguageSelected(ctx: BotContext): Promise<boolean>;
