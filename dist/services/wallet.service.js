import { Decimal } from "@prisma/client/runtime/library";
import { prisma } from "../db/client.js";
import { BusinessError } from "../lib/errors.js";
import { detectLocale } from "../lib/locale.js";
export async function getBalance(userId) {
    const last = await prisma.ledgerEntry.findFirst({
        where: { userId },
        orderBy: { createdAt: "desc" },
    });
    return last?.balanceAfter ?? new Decimal(0);
}
export async function addLedgerEntry(params) {
    const current = await getBalance(params.userId);
    const balanceAfter = current.add(params.amount);
    if (balanceAfter.lessThan(0)) {
        throw new BusinessError("INSUFFICIENT_BALANCE");
    }
    await prisma.ledgerEntry.create({
        data: {
            userId: params.userId,
            type: params.type,
            amount: params.amount,
            balanceAfter,
            referenceId: params.referenceId,
            note: params.note,
        },
    });
    return { balanceAfter };
}
export async function findOrCreateUser(telegramUser) {
    const detected = detectLocale(telegramUser.language_code);
    return prisma.user.upsert({
        where: { telegramId: BigInt(telegramUser.id) },
        update: {
            username: telegramUser.username,
            firstName: telegramUser.first_name,
            lastName: telegramUser.last_name,
        },
        create: {
            telegramId: BigInt(telegramUser.id),
            username: telegramUser.username,
            firstName: telegramUser.first_name,
            lastName: telegramUser.last_name,
            language: detected,
            languageConfirmed: false,
            onboardingCompleted: false,
        },
    });
}
export async function completeOnboarding(userId) {
    return prisma.user.update({
        where: { id: userId },
        data: { onboardingCompleted: true },
    });
}
export async function setUserLanguage(userId, language) {
    return prisma.user.update({
        where: { id: userId },
        data: { language, languageConfirmed: true },
    });
}
export async function getUserLanguageByTelegramId(telegramId) {
    const user = await prisma.user.findUnique({ where: { telegramId } });
    if (user?.language === "tr" || user?.language === "en" || user?.language === "ru") {
        return user.language;
    }
    return "en";
}
//# sourceMappingURL=wallet.service.js.map