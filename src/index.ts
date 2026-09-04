import { disconnectDb } from "./db/client.js";
import { startBot, stopBot } from "./bot/index.js";
import { startMonthlyProfitJob } from "./jobs/monthly-profit.job.js";
import { startWithdrawNotifyJob } from "./jobs/withdraw-notify.job.js";
import { logger } from "./lib/logger.js";
import express from "express"; // 1. Express-i goşuň

let shuttingDown = false;

// 2. Render üçin ýönekeý HTTP serwer dörediň
const app = express();
const PORT = process.env.PORT || 3000;

app.get("/", (req, res) => {
  res.send("Vanguard Bot is running!");
});

app.listen(PORT, () => {
  logger.info({ port: PORT }, "Web serwer porty diňlenilýär");
});

async function shutdown(signal: string): Promise<void> {
  if (shuttingDown) return;
  shuttingDown = true;
  logger.info({ signal }, "Kapanis basladi");
  await stopBot();
  await disconnectDb();
  process.exit(0);
}

async function main(): Promise<void> {
  startMonthlyProfitJob();
  startWithdrawNotifyJob();
  await startBot();
}

main().catch(async (error) => {
  logger.fatal({ error: error instanceof Error ? error.message : error }, "Uygulama baslatilamadi");
  if (error instanceof Error) {
    console.error("\n" + error.message + "\n");
  }
  await stopBot();
  process.exit(1);
});

process.once("SIGINT", () => {
  void shutdown("SIGINT");
});

process.once("SIGTERM", () => {
  void shutdown("SIGTERM");
});