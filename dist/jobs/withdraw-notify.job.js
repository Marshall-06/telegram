import cron from "node-cron";
import { env } from "../config/env.js";
import { logger } from "../lib/logger.js";
import { isWithdrawDay, parseWithdrawDays } from "../lib/withdraw-schedule.js";
import { createBot } from "../bot/index.js";
import { notifyAdminsPendingWithdrawals } from "../bot/commands/admin.js";
export function startWithdrawNotifyJob() {
    const hour = env.WITHDRAW_NOTIFY_HOUR;
    const days = parseWithdrawDays(env.WITHDRAW_DAYS);
    cron.schedule(`0 ${hour} * * *`, async () => {
        const today = new Date();
        if (!isWithdrawDay(today, days))
            return;
        try {
            const bot = createBot();
            await notifyAdminsPendingWithdrawals(bot);
            logger.info({ day: today.getDate(), pendingNotify: true }, "Cekim gunu listesi adminlere gonderildi");
        }
        catch (error) {
            logger.error({ error }, "Cekim listesi bildirimi basarisiz");
        }
    });
    logger.info({ days: env.WITHDRAW_DAYS, hour }, "Cekim gunu bildirim job'u aktif");
}
//# sourceMappingURL=withdraw-notify.job.js.map