import { config as loadEnv } from "dotenv";
import { z } from "zod";
loadEnv();
const envSchema = z.object({
    BOT_TOKEN: z.string().min(1),
    NODE_ENV: z.enum(["development", "production", "test"]).default("development"),
    LOG_LEVEL: z.enum(["debug", "info", "warn", "error"]).default("info"),
    DATABASE_URL: z.string().min(1),
    MIN_DEPOSIT: z.coerce.number().positive().default(10),
    MIN_WITHDRAW: z.coerce.number().positive().default(10),
    WITHDRAW_DAYS: z.string().default("1,15"),
    WITHDRAW_NOTIFY_HOUR: z.coerce.number().min(0).max(23).default(9),
    ADMIN_TELEGRAM_IDS: z.string().default(""),
    MONTHLY_PROFIT_RATE: z.coerce.number().min(0).max(100).default(5),
    DEFAULT_CURRENCY: z.string().default("USDT"),
    WALLET_NETWORK: z.string().default("BEP20"),
    MASTER_TRUST_WALLET: z.string().optional(),
    WM_WMID: z.string().optional(),
    WM_PURSE: z.string().optional(),
    WM_KEY_PATH: z.string().optional(),
    TELEGRAM_PROXY: z.string().optional(),
});
export const env = envSchema.parse(process.env);
export function getAdminTelegramIds() {
    if (!env.ADMIN_TELEGRAM_IDS.trim())
        return [];
    return env.ADMIN_TELEGRAM_IDS.split(",")
        .map((id) => parseInt(id.trim(), 10))
        .filter((id) => !Number.isNaN(id));
}
//# sourceMappingURL=env.js.map