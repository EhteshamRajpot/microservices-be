import { CustomError } from "./custom-error.js";
export class BadRequestError extends CustomError {
    message;
    statusCode = 400;
    constructor(message) {
        super(message);
        this.message = message;
        Object.setPrototypeOf(this, BadRequestError.prototype);
    }
    serializeErrors() {
        return [{ message: this.message }];
    }
}
//# sourceMappingURL=bad-request-error.js.map