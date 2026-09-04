import { Decimal } from "@prisma/client/runtime/library";
import { prisma } from "../db/client.js";
import { env } from "../config/env.js";
import { BusinessError } from "../lib/errors.js";
import { addLedgerEntry, getBalance } from "./wallet.service.js";
import { getNextWithdrawDate, parseWithdrawDays } from "../lib/withdraw-schedule.js";
export async function getPendingWithdrawTotal(userId) {
    const pending = await prisma.withdrawal.aggregate({
        where: { userId, status: "pending" },
        _sum: { amount: true },
    });
    return pending._sum.amount ?? new Decimal(0);
}
export async function getAvailableBalance(userId) {
    const balance = await getBalance(userId);
    const reserved = await getPendingWithdrawTotal(userId);
    return balance.sub(reserved);
}
export async function createWithdrawalRequest(userId, amount, trustWallet) {
    if (amount < env.MIN_WITHDRAW) {
        throw new BusinessError("MIN_WITHDRAW", { min: env.MIN_WITHDRAW });
    }
    const available = await getAvailableBalance(userId);
    if (available.lessThan(amount)) {
        throw new BusinessError("INSUFFICIENT_BALANCE", {
            available: available.toFixed(2),
            currency: env.DEFAULT_CURRENCY,
        });
    }
    const withdrawDays = parseWithdrawDays(env.WITHDRAW_DAYS);
    const scheduledFor = getNextWithdrawDate(new Date(), withdrawDays);
    await prisma.user.update({
        where: { id: userId },
        data: { trustWallet },
    });
    return prisma.withdrawal.create({
        data: {
            userId,
            amount: new Decimal(amount),
            walletAddressSnapshot: trustWallet,
            status: "pending",
            scheduledFor,
        },
    });
}
export async function getPendingWithdrawals() {
    return prisma.withdrawal.findMany({
        where: { status: "pending" },
        include: { user: true },
        orderBy: { createdAt: "asc" },
    });
}
export function formatWithdrawalList(items, locale = "tr") {
    if (items.length === 0) {
        return locale === "ru"
            ? "Нет ожидающих заявок на вывод."
            : locale === "en"
                ? "No pending withdrawal requests."
                : "Bekleyen cekim talebi yok.";
    }
    const total = items.reduce((sum, item) => sum.add(item.amount), new Decimal(0));
    const lines = items.map((item, index) => {
        const name = [item.user.firstName, item.user.lastName]
            .filter(Boolean)
            .join(" ");
        const username = item.user.username ? `@${item.user.username}` : "-";
        const wallet = item.walletAddressSnapshot ??
            item.wmPurseSnapshot ??
            item.user.trustWallet ??
            item.user.wmPurse ??
            "-";
        return (`${index + 1}. ID: \`${item.id.slice(-8)}\`\n` +
            `   Kullanici: ${username} (${name || "-"})\n` +
            `   Trust Wallet: \`${wallet}\`\n` +
            `   Tutar: ${item.amount.toFixed(2)} ${env.DEFAULT_CURRENCY}\n` +
            `   Talep: ${item.createdAt.toLocaleDateString("tr-TR")}\n` +
            `   Planlanan: ${item.scheduledFor?.toLocaleDateString("tr-TR") ?? "-"}`);
    });
    return (`*CEKIM LISTESI* (${items.length} talep)\n` +
        `Toplam: *${total.toFixed(2)} ${env.DEFAULT_CURRENCY}*\n\n` +
        lines.join("\n\n") +
        `\n\n_Gonderim yaptiktan sonra:_\n` +
        `\`/admin_cekim_tamam ID\` ile bakiyeyi dusun\n` +
        `\`/admin_cekim_iptal ID\` ile talebi iptal edin`);
}
export async function completeWithdrawal(withdrawalId, adminNote) {
    const withdrawal = await prisma.withdrawal.findUnique({
        where: { id: withdrawalId },
        include: { user: true },
    });
    if (!withdrawal) {
        throw new BusinessError("WITHDRAWAL_NOT_FOUND");
    }
    if (withdrawal.status !== "pending") {
        throw new BusinessError("WITHDRAWAL_ALREADY_PROCESSED");
    }
    await addLedgerEntry({
        userId: withdrawal.userId,
        type: "withdrawal",
        amount: withdrawal.amount.negated(),
        referenceId: withdrawal.id,
        note: adminNote ?? "Manual withdrawal",
    });
    return prisma.withdrawal.update({
        where: { id: withdrawalId },
        data: {
            status: "completed",
            processedAt: new Date(),
            adminNote,
        },
        include: { user: true },
    });
}
export async function cancelWithdrawal(withdrawalId, adminNote) {
    const withdrawal = await prisma.withdrawal.findUnique({
        where: { id: withdrawalId },
    });
    if (!withdrawal) {
        throw new BusinessError("WITHDRAWAL_NOT_FOUND");
    }
    if (withdrawal.status !== "pending") {
        throw new BusinessError("WITHDRAWAL_ALREADY_PROCESSED");
    }
    return prisma.withdrawal.update({
        where: { id: withdrawalId },
        data: {
            status: "cancelled",
            processedAt: new Date(),
            adminNote,
        },
        include: { user: true },
    });
}
export async function findWithdrawalByShortId(shortId) {
    const pending = await getPendingWithdrawals();
    return pending.find((w) => w.id.endsWith(shortId) || w.id === shortId);
}
//# sourceMappingURL=withdrawal.service.js.map