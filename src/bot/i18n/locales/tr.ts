import { env } from "../../../config/env.js";
import type { LocalePack, TranslateParams, TranslationKey } from "../types.js";

function tpl(template: string, params?: TranslateParams): string {
  if (!params) return template;
  return template.replace(/\{(\w+)\}/g, (_, key: string) => {
    const value = params[key as keyof TranslateParams];
    return value !== undefined ? String(value) : `{${key}}`;
  });
}

const messages: Record<TranslationKey, string> = {
  welcome:
    "Merhaba {name}!\n\n*Vanguard Investments* platformuna hos geldiniz.",
  about:
    "*Proje Hakkinda*\n\n" +
    "• Ana odeme: Trust Wallet ({network})\n" +
    "• Para birimi: {currency}\n" +
    "• Yatirimlar kayit altina alinir\n" +
    "• Aylik sabit kar payi dagitilir\n\n" +
    "_Bu metni zenginlestirmek icin: src/bot/i18n/locales/tr.ts → about_",
  howItWorks:
    "*Nasil Calisir?*\n\n" +
    "1️⃣ *Yatirim* — /deposit ile tutar girin, Trust Wallet adresine gonderin\n" +
    "2️⃣ *Onay* — Yatiriminiz kontrol edilir, bakiyenize eklenir\n" +
    "3️⃣ *Kar* — Her ay sabit oran uzerinden kar dagitilir\n" +
    "4️⃣ *Cekim* — /withdraw ile talep olusturun, belirlenen gunlerde odeme yapilir\n\n" +
    "_Bu metni zenginlestirmek icin: tr.ts → howItWorks_",
  importantNotes:
    "*Onemli Bilgiler*\n\n" +
    "• Min. yatirim: {min} {currency}\n" +
    "• Min. cekim: {minWithdraw} {currency}\n" +
    "• Aylik kar orani: %{profitRate}\n" +
    "• Cekim gunleri: {withdrawDays}\n" +
    "• Ag: {network}\n\n" +
    "_Bu metni zenginlestirmek icin: tr.ts → importantNotes_",
  onboardingMenuPrompt: "Okumak istediginiz konuyu secin:",
  onboardingBtnAbout: "📋 Proje hakkinda",
  onboardingBtnHow: "⚙️ Nasil calisir?",
  onboardingBtnNotes: "⚠️ Onemli bilgiler",
  onboardingConfirm: "✅ Anladim, baslayalim",
  onboardingDone: "Hazirsaniz! Asagidaki menuden isleminizi secin.",
  help:
    "*Komut Listesi*\n\n/start - Hos geldin\n/about - Proje tanitimi\n/balance - Bakiye\n/deposit - Yatirim\n/withdraw - Cekim\n/history - Gecmis\n/language - Dil secimi\n/help - Yardim\n/cancel - Iptal",
  balance: "*Guncel Bakiyeniz*\n\nToplam: {amount} {currency}\nCekilebilir: {available} {currency}",
  depositPrompt: "Yatirmak istediginiz {currency} tutarini girin (minimum {min}):",
  depositCreated:
    "*Yatirim Talimati*\n\nTutar: {amount} {currency}\nAg: {network}\nAna Trust Wallet:\n`{masterWallet}`\n\nReferans (memo):\n`{reference}`\n\n_Gonderim sonrasi yatiriminiz onaylanacaktir._",
  depositNoMasterWallet:
    "Ana Trust Wallet henuz tanimlanmadi.\nYonetici ile iletisime gecin.",
  withdrawWalletPrompt:
    "Trust Wallet adresinizi girin ({network}, ornek: 0x...):",
  withdrawAmountPrompt:
    "Cekmek istediginiz {currency} tutarini girin (minimum {min}).\n\nCekim gunleri: {withdrawDays}",
  withdrawCreated:
    "*Cekim Talebi Alindi*\n\nTutar: {amount} {currency}\nDurum: Onay bekliyor\nPlanlanan gun: {scheduledFor}\n\n_Gonderim sonrasi bakiyeniz guncellenecektir._",
  withdrawCompletedUser: "Cekim talebiniz tamamlandi.\nGonderilen tutar: {amount} {currency}",
  withdrawCancelledUser: "Cekim talebiniz iptal edildi.\nTutar: {amount} {currency}",
  invalidWallet:
    "Gecersiz Trust Wallet adresi.\nOrnek: 0x ile baslayan 42 karakter ({network})",
  historyEmpty: "Henuz islem gecmisiniz bulunmuyor.",
  historyHeader: "*Son Islemleriniz*\n",
  historyLine: "• {type}: {amount} → {balanceAfter} ({date})",
  invalidAmount: "Gecersiz tutar. Lutfen pozitif bir sayi girin.",
  cancelled: "Islem iptal edildi.",
  error: "Hata: {error}",
  adminOnly: "Bu komut sadece yonetici icindir.",
  adminWithdrawCompleted:
    "Cekim tamamlandi.\nID: {id}\nKullanici: {user}\nTutar: {amount} {currency}\nBakiye dusuldu.",
  adminWithdrawCancelled:
    "Cekim iptal edildi.\nID: {id}\nKullanici: {user}\nTutar: {amount} {currency}",
  adminWithdrawNotFound: "Cekim talebi bulunamadi. ID'yi kontrol edin.",
  adminPanel:
    "*Admin Paneli*\n\nBot: @{botUsername}\n\n*Komutlar:*\n/admin\\_cekimler - Bekleyen cekim listesi\n/admin\\_cekim\\_tamam ID - Onayla\n/admin\\_cekim\\_iptal ID - Iptal\n\n*Link:*\nhttps://t.me/{botUsername}?start=admin",
  adminUsageComplete: "Kullanim: /admin_cekim_tamam TALEP_ID",
  adminUsageCancel: "Kullanim: /admin_cekim_iptal TALEP_ID",
  languagePrompt:
    "Lutfen dil secin:\n\n🇹🇷 Turkce\n🇬🇧 English\n🇷🇺 Russkiy",
  startLanguageSelect:
    "Welcome {name}, select language:\n\n🇹🇷 Turkce\n🇬🇧 English\n🇷🇺 Russkiy",
  languageChanged: "Dil guncellendi.",
  chooseLanguage: "🇹🇷 Dil / 🇬🇧 Language / 🇷🇺 Язык",
};

export const tr: LocalePack = {
  menu: {
    balance: "Bakiye",
    deposit: "Yatirim",
    withdraw: "Cekim",
    history: "Gecmis",
    about: "Proje",
    help: "Yardim",
    language: "🇹🇷 Dil",
    cancel: "Iptal",
  },
  ledgerTypes: {
    deposit: "yatirim",
    withdrawal: "cekim",
    profit: "kar",
    fee: "ucret",
    adjustment: "duzeltme",
  },
  errors: {
    INSUFFICIENT_BALANCE: "Yetersiz bakiye. Kullanilabilir: {available} {currency}",
    MIN_WITHDRAW: "Minimum cekim tutari: {min}",
    MIN_DEPOSIT: "Minimum yatirim tutari: {min}",
    WITHDRAWAL_NOT_FOUND: "Cekim talebi bulunamadi",
    WITHDRAWAL_ALREADY_PROCESSED: "Talep zaten islenmis",
    PROFIT_ALREADY_DISTRIBUTED: "Bu ay icin kar dagitimi zaten yapildi",
    UNKNOWN: "Bilinmeyen hata",
  },
  t(key: TranslationKey, params?: TranslateParams): string {
    const base = messages[key];
    const merged: TranslateParams = {
      currency: env.DEFAULT_CURRENCY,
      network: env.WALLET_NETWORK,
      ...params,
    };
    return tpl(base, merged);
  },
};
