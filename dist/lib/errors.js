export class BusinessError extends Error {
    code;
    params;
    constructor(code, params) {
        super(code);
        this.code = code;
        this.params = params;
        this.name = "BusinessError";
    }
}
//# sourceMappingURL=errors.js.map