import { Bot } from "grammy";
import type { BotContext } from "./context.js";
export declare function createBot(): Bot<BotContext>;
export declare function stopBot(): Promise<void>;
export declare function startBot(): Promise<Bot<BotContext>>;
