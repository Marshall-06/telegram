import cron from "node-cron";
import { logger } from "../lib/logger.js";
import { distributeMonthlyProfit } from "../services/investment.service.js";
import { env } from "../config/env.js";
export function startMonthlyProfitJob() {
    // Her ayin 1'i saat 09:00'da (sunucu saati)
    cron.schedule("0 9 1 * *", async () => {
        const now = new Date();
        const year = now.getFullYear();
        const month = now.getMonth() + 1;
        try {
            const result = await distributeMonthlyProfit(year, month);
            logger.info({
                year,
                month,
                rate: env.MONTHLY_PROFIT_RATE,
                total: result.totalDistributed.toString(),
            }, "Aylik kar dagitimi tamamlandi");
        }
        catch (error) {
            logger.error({ error, year, month }, "Aylik kar dagitimi basarisiz");
        }
    });
    logger.info("Aylik kar dagitim job'u aktif (her ayin 1'i 09:00)");
}
//# sourceMappingURL=monthly-profit.job.js.map