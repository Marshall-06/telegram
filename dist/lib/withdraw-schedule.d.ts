export declare function parseWithdrawDays(raw: string): number[];
export declare function formatWithdrawDays(days: number[]): string;
export declare function isWithdrawDay(date: Date, days: number[]): boolean;
export declare function getNextWithdrawDate(from: Date, days: number[]): Date;
