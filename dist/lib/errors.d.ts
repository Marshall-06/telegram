export declare class BusinessError extends Error {
    readonly code: string;
    readonly params?: Record<string, string | number> | undefined;
    constructor(code: string, params?: Record<string, string | number> | undefined);
}
