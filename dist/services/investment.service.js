import { Decimal } from "@prisma/client/runtime/library";
import { prisma } from "../db/client.js";
import { env } from "../config/env.js";
import { addLedgerEntry } from "./wallet.service.js";
import { BusinessError } from "../lib/errors.js";
export async function createDepositRequest(userId, amount) {
    if (amount < env.MIN_DEPOSIT) {
        throw new BusinessError("MIN_DEPOSIT", { min: env.MIN_DEPOSIT });
    }
    const reference = `DEP-${Date.now()}-${Math.random().toString(36).slice(2, 8).toUpperCase()}`;
    return prisma.deposit.create({
        data: {
            userId,
            amount: new Decimal(amount),
            reference,
            status: "pending",
        },
    });
}
export async function distributeMonthlyProfit(year, month, rate) {
    const profitRate = rate ?? env.MONTHLY_PROFIT_RATE;
    const existing = await prisma.profitDistribution.findUnique({
        where: { periodYear_periodMonth: { periodYear: year, periodMonth: month } },
    });
    if (existing) {
        throw new BusinessError("PROFIT_ALREADY_DISTRIBUTED");
    }
    const users = await prisma.user.findMany({ where: { status: "active" } });
    let totalDistributed = new Decimal(0);
    for (const user of users) {
        const lastEntry = await prisma.ledgerEntry.findFirst({
            where: { userId: user.id },
            orderBy: { createdAt: "desc" },
        });
        const balance = lastEntry?.balanceAfter ?? new Decimal(0);
        if (balance.lte(0))
            continue;
        const profit = balance.mul(profitRate).div(100);
        if (profit.lte(0))
            continue;
        await addLedgerEntry({
            userId: user.id,
            type: "profit",
            amount: profit,
            note: `${year}-${String(month).padStart(2, "0")} aylik kar (%${profitRate})`,
        });
        totalDistributed = totalDistributed.add(profit);
    }
    return prisma.profitDistribution.create({
        data: {
            periodYear: year,
            periodMonth: month,
            profitRate: new Decimal(profitRate),
            totalDistributed,
        },
    });
}
//# sourceMappingURL=investment.service.js.map