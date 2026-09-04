import { Decimal } from "@prisma/client/runtime/library";
import type { Withdrawal, User } from "@prisma/client";
import type { Locale } from "../bot/i18n/types.js";
type WithdrawalWithUser = Withdrawal & {
    user: User;
};
export declare function getPendingWithdrawTotal(userId: string): Promise<Decimal>;
export declare function getAvailableBalance(userId: string): Promise<Decimal>;
export declare function createWithdrawalRequest(userId: string, amount: number, trustWallet: string): Promise<{
    id: string;
    userId: string;
    amount: Decimal;
    fee: Decimal;
    currency: string;
    wmPurseSnapshot: string | null;
    walletAddressSnapshot: string | null;
    wmTransferId: string | null;
    status: string;
    scheduledFor: Date | null;
    adminNote: string | null;
    processedAt: Date | null;
    createdAt: Date;
}>;
export declare function getPendingWithdrawals(): Promise<WithdrawalWithUser[]>;
export declare function formatWithdrawalList(items: WithdrawalWithUser[], locale?: Locale): string;
export declare function completeWithdrawal(withdrawalId: string, adminNote?: string): Promise<{
    user: {
        id: string;
        telegramId: bigint;
        username: string | null;
        firstName: string | null;
        lastName: string | null;
        wmPurse: string | null;
        trustWallet: string | null;
        language: string;
        languageConfirmed: boolean;
        onboardingCompleted: boolean;
        status: string;
        createdAt: Date;
        updatedAt: Date;
    };
} & {
    id: string;
    userId: string;
    amount: Decimal;
    fee: Decimal;
    currency: string;
    wmPurseSnapshot: string | null;
    walletAddressSnapshot: string | null;
    wmTransferId: string | null;
    status: string;
    scheduledFor: Date | null;
    adminNote: string | null;
    processedAt: Date | null;
    createdAt: Date;
}>;
export declare function cancelWithdrawal(withdrawalId: string, adminNote?: string): Promise<{
    user: {
        id: string;
        telegramId: bigint;
        username: string | null;
        firstName: string | null;
        lastName: string | null;
        wmPurse: string | null;
        trustWallet: string | null;
        language: string;
        languageConfirmed: boolean;
        onboardingCompleted: boolean;
        status: string;
        createdAt: Date;
        updatedAt: Date;
    };
} & {
    id: string;
    userId: string;
    amount: Decimal;
    fee: Decimal;
    currency: string;
    wmPurseSnapshot: string | null;
    walletAddressSnapshot: string | null;
    wmTransferId: string | null;
    status: string;
    scheduledFor: Date | null;
    adminNote: string | null;
    processedAt: Date | null;
    createdAt: Date;
}>;
export declare function findWithdrawalByShortId(shortId: string): Promise<WithdrawalWithUser | undefined>;
export {};
