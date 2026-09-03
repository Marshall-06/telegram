export function getTelegramNetworkHelp(error: unknown): string {
  const message = error instanceof Error ? error.message : String(error);
  const isNetworkError =
    message.includes("ENOTFOUND") ||
    message.includes("ECONNREFUSED") ||
    message.includes("ETIMEDOUT") ||
    message.includes("127.0.0.1");

  if (!isNetworkError) {
    return message;
  }

  return (
    "Telegram API'ye baglanilamiyor.\n\n" +
    "Muhtemel neden: Ag/DNS Telegram'i engelliyor (api.telegram.org -> 127.0.0.1).\n\n" +
    "Cozum secenekleri:\n" +
    "1. VPN acip npm run dev tekrar calistirin\n" +
    "2. Botu dis agdaki sunucuda calistirin (VPS)\n" +
    "3. Proxy varsa .env icine TELEGRAM_PROXY=http://host:port ekleyin\n" +
    "4. Kurumsal agdaysaniz IT'den Telegram API erisimi isteyin\n\n" +
    `Teknik hata: ${message}`
  );
}
