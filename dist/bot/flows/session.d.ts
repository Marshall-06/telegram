import type { SessionData, FlowStep } from "../i18n/types.js";
export declare function clearFlow(session: SessionData): void;
export declare function startFlow(session: SessionData, step: FlowStep): void;
export declare function isInFlow(session: SessionData): boolean;
export declare function parseAmount(text: string): number | null;
