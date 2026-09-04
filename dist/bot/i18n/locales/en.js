import { env } from "../../../config/env.js";
function tpl(template, params) {
    if (!params)
        return template;
    return template.replace(/\{(\w+)\}/g, (_, key) => {
        const value = params[key];
        return value !== undefined ? String(value) : `{${key}}`;
    });
}
const messages = {
    welcome: "Hello {name}!\n\nWelcome to *Vanguard Investments*.",
    about: "*About the Project*\n\n" +
        "• Payment: Trust Wallet ({network})\n" +
        "• Currency: {currency}\n" +
        "• Deposits are recorded securely\n" +
        "• Fixed monthly profit share\n\n" +
        "_Edit this text in: src/bot/i18n/locales/en.ts → about_",
    howItWorks: "*How It Works*\n\n" +
        "1️⃣ *Deposit* — use /deposit, send to Trust Wallet address\n" +
        "2️⃣ *Confirm* — deposit is verified and added to balance\n" +
        "3️⃣ *Profit* — monthly fixed-rate profit distribution\n" +
        "4️⃣ *Withdraw* — use /withdraw, paid on scheduled days\n\n" +
        "_Edit this text in: en.ts → howItWorks_",
    importantNotes: "*Important Notes*\n\n" +
        "• Min. deposit: {min} {currency}\n" +
        "• Min. withdrawal: {minWithdraw} {currency}\n" +
        "• Monthly profit rate: {profitRate}%\n" +
        "• Withdrawal days: {withdrawDays}\n" +
        "• Network: {network}\n\n" +
        "_Edit this text in: en.ts → importantNotes_",
    onboardingMenuPrompt: "Choose a topic to read:",
    onboardingBtnAbout: "📋 About the project",
    onboardingBtnHow: "⚙️ How it works",
    onboardingBtnNotes: "⚠️ Important notes",
    onboardingConfirm: "✅ Got it, let's start",
    onboardingDone: "You're ready! Choose an action from the menu below.",
    help: "*Commands*\n\n/start - Welcome\n/about - About project\n/balance - Balance\n/deposit - Deposit\n/withdraw - Withdraw\n/history - History\n/language - Language\n/help - Help\n/cancel - Cancel",
    balance: "*Your Balance*\n\nTotal: {amount} {currency}\nAvailable: {available} {currency}",
    depositPrompt: "Enter {currency} amount to deposit (minimum {min}):",
    depositCreated: "*Deposit Instructions*\n\nAmount: {amount} {currency}\nNetwork: {network}\nMain Trust Wallet:\n`{masterWallet}`\n\nReference (memo):\n`{reference}`\n\n_Your deposit will be confirmed after transfer._",
    depositNoMasterWallet: "Main Trust Wallet is not configured yet.\nPlease contact admin.",
    withdrawWalletPrompt: "Enter your Trust Wallet address ({network}, e.g. 0x...):",
    withdrawAmountPrompt: "Enter {currency} amount to withdraw (minimum {min}).\n\nWithdrawal days: {withdrawDays}",
    withdrawCreated: "*Withdrawal Request Received*\n\nAmount: {amount} {currency}\nStatus: Pending\nScheduled date: {scheduledFor}\n\n_Balance updates after transfer._",
    withdrawCompletedUser: "Withdrawal completed.\nSent amount: {amount} {currency}",
    withdrawCancelledUser: "Withdrawal cancelled.\nAmount: {amount} {currency}",
    invalidWallet: "Invalid Trust Wallet address.\nExample: 42 chars starting with 0x ({network})",
    historyEmpty: "No transaction history yet.",
    historyHeader: "*Recent Transactions*\n",
    historyLine: "• {type}: {amount} → {balanceAfter} ({date})",
    invalidAmount: "Invalid amount. Please enter a positive number.",
    cancelled: "Operation cancelled.",
    error: "Error: {error}",
    adminOnly: "This command is for administrators only.",
    adminWithdrawCompleted: "Withdrawal completed.\nID: {id}\nUser: {user}\nAmount: {amount} {currency}\nBalance updated.",
    adminWithdrawCancelled: "Withdrawal cancelled.\nID: {id}\nUser: {user}\nAmount: {amount} {currency}",
    adminWithdrawNotFound: "Withdrawal request not found. Check the ID.",
    adminPanel: "*Admin Panel*\n\nBot: @{botUsername}\n\n*Commands:*\n/admin\\_cekimler - Pending withdrawals\n/admin\\_cekim\\_tamam ID - Approve\n/admin\\_cekim\\_iptal ID - Cancel\n\n*Link:*\nhttps://t.me/{botUsername}?start=admin",
    adminUsageComplete: "Usage: /admin_cekim_tamam REQUEST_ID",
    adminUsageCancel: "Usage: /admin_cekim_iptal REQUEST_ID",
    languagePrompt: "Please select your language:\n\n🇹🇷 Türkçe\n🇬🇧 English\n🇷🇺 Русский",
    startLanguageSelect: "Welcome {name}, select language:\n\n🇹🇷 Türkçe\n🇬🇧 English\n🇷🇺 Русский",
    languageChanged: "Language updated.",
    chooseLanguage: "🇹🇷 Türkçe / 🇬🇧 English / 🇷🇺 Русский",
};
export const en = {
    menu: {
        balance: "Balance",
        deposit: "Deposit",
        withdraw: "Withdraw",
        history: "History",
        about: "About",
        help: "Help",
        language: "🇬🇧 Language",
        cancel: "Cancel",
    },
    ledgerTypes: {
        deposit: "deposit",
        withdrawal: "withdrawal",
        profit: "profit",
        fee: "fee",
        adjustment: "adjustment",
    },
    errors: {
        INSUFFICIENT_BALANCE: "Insufficient balance. Available: {available} {currency}",
        MIN_WITHDRAW: "Minimum withdrawal amount: {min}",
        MIN_DEPOSIT: "Minimum deposit amount: {min}",
        WITHDRAWAL_NOT_FOUND: "Withdrawal request not found",
        WITHDRAWAL_ALREADY_PROCESSED: "Request already processed",
        PROFIT_ALREADY_DISTRIBUTED: "Profit for this month already distributed",
        UNKNOWN: "Unknown error",
    },
    t(key, params) {
        const base = messages[key];
        const merged = {
            currency: env.DEFAULT_CURRENCY,
            network: env.WALLET_NETWORK,
            ...params,
        };
        return tpl(base, merged);
    },
};
//# sourceMappingURL=en.js.map