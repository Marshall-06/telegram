import { Decimal } from "@prisma/client/runtime/library";
import type { Withdrawal, User } from "@prisma/client";
import type { Locale } from "../bot/i18n/types.js";
type WithdrawalWithUser = Withdrawal & {
    user: User;
};
export declare function getPendingWithdrawTotal(userId: string): Promise<Decimal>;
export declare function getAvailableBalance(userId: string): Promise<Decimal>;
export declare function createWithdrawalRequest(userId: string, amount: number, trustWallet: string): Promise<any>;
export declare function getPendingWithdrawals(): Promise<WithdrawalWithUser[]>;
export declare function formatWithdrawalList(items: WithdrawalWithUser[], locale?: Locale): string;
export declare function completeWithdrawal(withdrawalId: string, adminNote?: string): Promise<any>;
export declare function cancelWithdrawal(withdrawalId: string, adminNote?: string): Promise<any>;
export declare function findWithdrawalByShortId(shortId: string): Promise<any>;
export {};
