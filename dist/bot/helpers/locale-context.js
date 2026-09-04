import { detectLocale } from "../i18n/index.js";
import { findOrCreateUser } from "../../services/wallet.service.js";
export async function getDbUser(ctx) {
    const from = ctx.from;
    if (!from)
        return null;
    return findOrCreateUser(from);
}
export function getUserLocale(user, fallbackCode) {
    if (user?.language === "tr" || user?.language === "en" || user?.language === "ru") {
        return user.language;
    }
    return detectLocale(fallbackCode);
}
export async function resolveContextLocale(ctx) {
    const user = await getDbUser(ctx);
    return getUserLocale(user, ctx.from?.language_code);
}
//# sourceMappingURL=locale-context.js.map