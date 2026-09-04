import type { User } from "@prisma/client";
import type { BotContext } from "../context.js";
import { type Locale } from "../i18n/index.js";
export declare function getDbUser(ctx: BotContext): Promise<any>;
export declare function getUserLocale(user: User | null | undefined, fallbackCode?: string): Locale;
export declare function resolveContextLocale(ctx: BotContext): Promise<Locale>;
