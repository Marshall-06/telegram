import type { Bot } from "grammy";
import type { BotContext } from "../context.js";
export type { BotContext } from "../context.js";
export declare function registerCommands(bot: Bot<BotContext>): void;
export declare function setupBotCommands(bot: Bot<BotContext>): Promise<void>;
