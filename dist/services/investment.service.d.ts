import { Decimal } from "@prisma/client/runtime/library";
export declare function createDepositRequest(userId: string, amount: number): Promise<{
    id: string;
    userId: string;
    amount: Decimal;
    currency: string;
    wmInvoiceId: string | null;
    reference: string;
    status: string;
    matchedAt: Date | null;
    createdAt: Date;
}>;
export declare function distributeMonthlyProfit(year: number, month: number, rate?: number): Promise<{
    id: string;
    periodYear: number;
    periodMonth: number;
    profitRate: Decimal;
    totalDistributed: Decimal;
    status: string;
    createdAt: Date;
}>;
