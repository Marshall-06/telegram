import type { Bot } from "grammy";
import type { BotContext } from "../context.js";
export declare function showAdminPanel(ctx: BotContext): Promise<void>;
export declare function registerAdminCommands(bot: Bot<BotContext>): void;
export declare function notifyAdminsPendingWithdrawals(bot: Bot<BotContext>): Promise<void>;
