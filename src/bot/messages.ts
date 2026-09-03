export function formatAmount(value: { toFixed: (n: number) => string }): string {
  return value.toFixed(2);
}

export function isValidTrustWalletAddress(address: string): boolean {
  return /^0x[a-fA-F0-9]{40}$/.test(address.trim());
}

export function normalizeTrustWalletAddress(address: string): string {
  return address.trim();
}
