export type Locale = "tr" | "en" | "ru";

export const LOCALES: Locale[] = ["tr", "en", "ru"];

export type MenuAction =
  | "balance"
  | "deposit"
  | "withdraw"
  | "history"
  | "about"
  | "help"
  | "language"
  | "cancel";

export type FlowStep = "deposit" | "withdraw_wallet" | "withdraw_amount";

export interface SessionData {
  awaiting?: FlowStep;
  trustWallet?: string;
}

export interface TranslateParams {
  name?: string;
  amount?: string;
  available?: string;
  currency?: string;
  min?: number;
  reference?: string;
  masterWallet?: string;
  network?: string;
  scheduledFor?: string;
  withdrawDays?: string;
  profitRate?: number;
  minWithdraw?: number;
  msg?: string;
  id?: string;
  user?: string;
  botUsername?: string;
  date?: string;
  type?: string;
  balanceAfter?: string;
  error?: string;
}

export type TranslationKey =
  | "welcome"
  | "about"
  | "help"
  | "balance"
  | "depositPrompt"
  | "depositCreated"
  | "depositNoMasterWallet"
  | "withdrawWalletPrompt"
  | "withdrawAmountPrompt"
  | "withdrawCreated"
  | "withdrawCompletedUser"
  | "withdrawCancelledUser"
  | "invalidWallet"
  | "historyEmpty"
  | "historyHeader"
  | "historyLine"
  | "invalidAmount"
  | "cancelled"
  | "error"
  | "adminOnly"
  | "adminWithdrawCompleted"
  | "adminWithdrawCancelled"
  | "adminWithdrawNotFound"
  | "adminPanel"
  | "adminUsageComplete"
  | "adminUsageCancel"
  | "languagePrompt"
  | "startLanguageSelect"
  | "languageChanged"
  | "chooseLanguage"
  | "howItWorks"
  | "importantNotes"
  | "onboardingMenuPrompt"
  | "onboardingBtnAbout"
  | "onboardingBtnHow"
  | "onboardingBtnNotes"
  | "onboardingDone"
  | "onboardingConfirm";

export type MenuLabels = Record<MenuAction, string>;

export type LedgerTypeKey = "deposit" | "withdrawal" | "profit" | "fee" | "adjustment";

export interface LocalePack {
  menu: MenuLabels;
  ledgerTypes: Record<LedgerTypeKey, string>;
  errors: {
    INSUFFICIENT_BALANCE: string;
    MIN_WITHDRAW: string;
    MIN_DEPOSIT: string;
    WITHDRAWAL_NOT_FOUND: string;
    WITHDRAWAL_ALREADY_PROCESSED: string;
    PROFIT_ALREADY_DISTRIBUTED: string;
    UNKNOWN: string;
  };
  t: (key: TranslationKey, params?: TranslateParams) => string;
}
