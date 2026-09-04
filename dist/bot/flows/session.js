export function clearFlow(session) {
    session.awaiting = undefined;
    session.trustWallet = undefined;
}
export function startFlow(session, step) {
    clearFlow(session);
    session.awaiting = step;
}
export function isInFlow(session) {
    return session.awaiting !== undefined;
}
export function parseAmount(text) {
    const amount = parseFloat(text.replace(",", "."));
    if (Number.isNaN(amount) || amount <= 0)
        return null;
    return amount;
}
//# sourceMappingURL=session.js.map