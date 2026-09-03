import type { Context } from "grammy";
import type { SessionData } from "./i18n/types.js";

export type BotContext = Context & { session: SessionData };
