export class CustomError extends Error {
    constructor(message) {
        super(message);
        Object.setPrototypeOf(this, CustomError.prototype);
    }
}
//# sourceMappingURL=custom-error.js.map