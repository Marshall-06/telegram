import type { SessionData, FlowStep } from "../i18n/types.js";

export function clearFlow(session: SessionData): void {
  session.awaiting = undefined;
  session.trustWallet = undefined;
}

export function startFlow(session: SessionData, step: FlowStep): void {
  clearFlow(session);
  session.awaiting = step;
}

export function isInFlow(session: SessionData): boolean {
  return session.awaiting !== undefined;
}

export function parseAmount(text: string): number | null {
  const amount = parseFloat(text.replace(",", "."));
  if (Number.isNaN(amount) || amount <= 0) return null;
  return amount;
}
