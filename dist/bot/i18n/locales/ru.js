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
    welcome: "Здравствуйте, {name}!\n\nДобро пожаловать в *Vanguard Investments*.",
    about: "*О проекте*\n\n" +
        "• Оплата: Trust Wallet ({network})\n" +
        "• Валюта: {currency}\n" +
        "• Депозиты надежно учитываются\n" +
        "• Фиксированная месячная прибыль\n\n" +
        "_Редактировать: src/bot/i18n/locales/ru.ts → about_",
    howItWorks: "*Как это работает*\n\n" +
        "1️⃣ *Депозит* — /deposit, перевод на Trust Wallet\n" +
        "2️⃣ *Подтверждение* — депозит проверяется и зачисляется\n" +
        "3️⃣ *Прибыль* — ежемесячное распределение фиксированного процента\n" +
        "4️⃣ *Вывод* — /withdraw, выплата в установленные дни\n\n" +
        "_Редактировать: ru.ts → howItWorks_",
    importantNotes: "*Важная информация*\n\n" +
        "• Мин. депозит: {min} {currency}\n" +
        "• Мин. вывод: {minWithdraw} {currency}\n" +
        "• Месячная прибыль: {profitRate}%\n" +
        "• Дни вывода: {withdrawDays}\n" +
        "• Сеть: {network}\n\n" +
        "_Редактировать: ru.ts → importantNotes_",
    onboardingMenuPrompt: "Выберите тему для просмотра:",
    onboardingBtnAbout: "📋 О проекте",
    onboardingBtnHow: "⚙️ Как это работает",
    onboardingBtnNotes: "⚠️ Важная информация",
    onboardingConfirm: "✅ Понятно, начать",
    onboardingDone: "Готово! Выберите действие в меню ниже.",
    help: "*Команды*\n\n/start - Приветствие\n/about - О проекте\n/balance - Баланс\n/deposit - Депозит\n/withdraw - Вывод\n/history - История\n/language - Язык\n/help - Помощь\n/cancel - Отмена",
    balance: "*Ваш баланс*\n\nВсего: {amount} {currency}\nДоступно: {available} {currency}",
    depositPrompt: "Введите сумму {currency} для депозита (минимум {min}):",
    depositCreated: "*Инструкция по депозиту*\n\nСумма: {amount} {currency}\nСеть: {network}\nОсновной Trust Wallet:\n`{masterWallet}`\n\nРеференс (memo):\n`{reference}`\n\n_Депозит будет подтвержден после перевода._",
    depositNoMasterWallet: "Основной Trust Wallet еще не настроен.\nСвяжитесь с администратором.",
    withdrawWalletPrompt: "Введите адрес Trust Wallet ({network}, например 0x...):",
    withdrawAmountPrompt: "Введите сумму {currency} для вывода (минимум {min}).\n\nДни вывода: {withdrawDays}",
    withdrawCreated: "*Заявка на вывод принята*\n\nСумма: {amount} {currency}\nСтатус: Ожидание\nПланируемая дата: {scheduledFor}\n\n_Баланс обновится после перевода._",
    withdrawCompletedUser: "Вывод выполнен.\nОтправлено: {amount} {currency}",
    withdrawCancelledUser: "Вывод отменен.\nСумма: {amount} {currency}",
    invalidWallet: "Неверный адрес Trust Wallet.\nПример: 42 символа, начинается с 0x ({network})",
    historyEmpty: "История операций пока пуста.",
    historyHeader: "*Последние операции*\n",
    historyLine: "• {type}: {amount} → {balanceAfter} ({date})",
    invalidAmount: "Неверная сумма. Введите положительное число.",
    cancelled: "Операция отменена.",
    error: "Ошибка: {error}",
    adminOnly: "Эта команда только для администратора.",
    adminWithdrawCompleted: "Вывод выполнен.\nID: {id}\nПользователь: {user}\nСумма: {amount} {currency}\nБаланс списан.",
    adminWithdrawCancelled: "Вывод отменен.\nID: {id}\nПользователь: {user}\nСумма: {amount} {currency}",
    adminWithdrawNotFound: "Заявка на вывод не найдена. Проверьте ID.",
    adminPanel: "*Панель администратора*\n\nБот: @{botUsername}\n\n*Команды:*\n/admin\\_cekimler - Список выводов\n/admin\\_cekim\\_tamam ID - Подтвердить\n/admin\\_cekim\\_iptal ID - Отменить\n\n*Ссылка:*\nhttps://t.me/{botUsername}?start=admin",
    adminUsageComplete: "Использование: /admin_cekim_tamam ID",
    adminUsageCancel: "Использование: /admin_cekim_iptal ID",
    languagePrompt: "Vyberite yazyk:\n\n🇹🇷 Türkçe\n🇬🇧 English\n🇷🇺 Русский",
    startLanguageSelect: "Welcome {name}, select language:\n\n🇹🇷 Türkçe\n🇬🇧 English\n🇷🇺 Русский",
    languageChanged: "Язык обновлен.",
    chooseLanguage: "🇹🇷 Türkçe / 🇬🇧 English / 🇷🇺 Русский",
};
export const ru = {
    menu: {
        balance: "Баланс",
        deposit: "Депозит",
        withdraw: "Вывод",
        history: "История",
        about: "О проекте",
        help: "Помощь",
        language: "🇷🇺 Язык",
        cancel: "Отмена",
    },
    ledgerTypes: {
        deposit: "депозит",
        withdrawal: "вывод",
        profit: "прибыль",
        fee: "комиссия",
        adjustment: "корректировка",
    },
    errors: {
        INSUFFICIENT_BALANCE: "Недостаточно средств. Доступно: {available} {currency}",
        MIN_WITHDRAW: "Минимальная сумма вывода: {min}",
        MIN_DEPOSIT: "Минимальная сумма депозита: {min}",
        WITHDRAWAL_NOT_FOUND: "Заявка на вывод не найдена",
        WITHDRAWAL_ALREADY_PROCESSED: "Заявка уже обработана",
        PROFIT_ALREADY_DISTRIBUTED: "Прибыль за этот месяц уже распределена",
        UNKNOWN: "Неизвестная ошибка",
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
//# sourceMappingURL=ru.js.map