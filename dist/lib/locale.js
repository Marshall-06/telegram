export function detectLocale(languageCode) {
    if (!languageCode)
        return "en";
    const code = languageCode.toLowerCase();
    if (code.startsWith("tr"))
        return "tr";
    if (code.startsWith("ru"))
        return "ru";
    return "en";
}
//# sourceMappingURL=locale.js.map