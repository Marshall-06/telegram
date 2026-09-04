import { z } from "zod";
declare const envSchema: z.ZodObject<{
    BOT_TOKEN: z.ZodString;
    NODE_ENV: z.ZodDefault<z.ZodEnum<{
        development: "development";
        production: "production";
        test: "test";
    }>>;
    LOG_LEVEL: z.ZodDefault<z.ZodEnum<{
        debug: "debug";
        error: "error";
        info: "info";
        warn: "warn";
    }>>;
    DATABASE_URL: z.ZodString;
    MIN_DEPOSIT: z.ZodDefault<z.ZodCoercedNumber<unknown>>;
    MIN_WITHDRAW: z.ZodDefault<z.ZodCoercedNumber<unknown>>;
    WITHDRAW_DAYS: z.ZodDefault<z.ZodString>;
    WITHDRAW_NOTIFY_HOUR: z.ZodDefault<z.ZodCoercedNumber<unknown>>;
    ADMIN_TELEGRAM_IDS: z.ZodDefault<z.ZodString>;
    MONTHLY_PROFIT_RATE: z.ZodDefault<z.ZodCoercedNumber<unknown>>;
    DEFAULT_CURRENCY: z.ZodDefault<z.ZodString>;
    WALLET_NETWORK: z.ZodDefault<z.ZodString>;
    MASTER_TRUST_WALLET: z.ZodOptional<z.ZodString>;
    WM_WMID: z.ZodOptional<z.ZodString>;
    WM_PURSE: z.ZodOptional<z.ZodString>;
    WM_KEY_PATH: z.ZodOptional<z.ZodString>;
    TELEGRAM_PROXY: z.ZodOptional<z.ZodString>;
}, z.core.$strip>;
export type Env = z.infer<typeof envSchema>;
export declare const env: Env;
export declare function getAdminTelegramIds(): number[];
export {};
