export function formatAmount(value) {
    return value.toFixed(2);
}
export function isValidTrustWalletAddress(address) {
    return /^0x[a-fA-F0-9]{40}$/.test(address.trim());
}
export function normalizeTrustWalletAddress(address) {
    return address.trim();
}
//# sourceMappingURL=messages.js.map