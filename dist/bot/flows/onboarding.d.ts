import type { Bot } from "grammy";
import type { BotContext } from "../context.js";
import { type Locale } from "../i18n/index.js";
export declare function showOnboardingMenu(ctx: BotContext, locale: Locale, name: string): Promise<void>;
export declare function finishOnboarding(ctx: BotContext, locale: Locale): Promise<void>;
export declare function registerOnboardingHandlers(bot: Bot<BotContext>): void;
export declare function ensureOnboardingComplete(ctx: BotContext): Promise<boolean>;
