import { Decimal } from "@prisma/client/runtime/library";
import type { Locale } from "../bot/i18n/types.js";
export type LedgerType = "deposit" | "withdrawal" | "profit" | "fee" | "adjustment";
export declare function getBalance(userId: string): Promise<Decimal>;
export declare function addLedgerEntry(params: {
    userId: string;
    type: LedgerType;
    amount: Decimal;
    referenceId?: string;
    note?: string;
}): Promise<{
    balanceAfter: Decimal;
}>;
export declare function findOrCreateUser(telegramUser: {
    id: number;
    username?: string;
    first_name?: string;
    last_name?: string;
    language_code?: string;
}): Promise<any>;
export declare function completeOnboarding(userId: string): Promise<any>;
export declare function setUserLanguage(userId: string, language: Locale): Promise<any>;
export declare function getUserLanguageByTelegramId(telegramId: bigint): Promise<Locale>;
