import { config } from "dotenv";
import https from "https";
import { HttpsProxyAgent } from "https-proxy-agent";

config();

const token = process.env.BOT_TOKEN;
const proxy = process.env.TELEGRAM_PROXY;

if (!token) {
  console.error("HATA: .env icinde BOT_TOKEN tanimli degil");
  process.exit(1);
}

function checkTelegram(): Promise<void> {
  return new Promise((resolve, reject) => {
    const agent = proxy ? new HttpsProxyAgent(proxy) : undefined;

    https
      .get(`https://api.telegram.org/bot${token}/getMe`, { agent, timeout: 15000 }, (res) => {
        let body = "";
        res.on("data", (chunk) => {
          body += chunk;
        });
        res.on("end", () => {
          try {
            const data = JSON.parse(body) as {
              ok: boolean;
              result?: { username?: string; first_name?: string };
              description?: string;
            };
            if (data.ok && data.result?.username) {
              console.log(`BASARILI: @${data.result.username} (${data.result.first_name ?? "bot"})`);
              resolve();
              return;
            }
            reject(new Error(data.description ?? body));
          } catch {
            reject(new Error(body || "Gecersiz yanit"));
          }
        });
      })
      .on("error", reject)
      .on("timeout", () => reject(new Error("Baglanti zaman asimi (15s)")));
  });
}

checkTelegram().catch((error: Error) => {
  console.error("HATA: Telegram API'ye ulasilamiyor");
  console.error(error.message);
  console.error("");
  console.error("Kontrol listesi:");
  console.error("  1. PdaNet + telefon VPN acik mi?");
  console.error("  2. Kerio / kurumsal ag adaptoru KAPALI mi?");
  console.error("  3. Sadece PdaNet adaptoru Up olmali");
  console.error("  4. ipconfig /flushdns calistir");
  console.error("  5. Tarayicida https://api.telegram.org aciliyor mu?");
  console.error("  6. npm run check:telegram tekrar dene");
  process.exit(1);
});
