"use strict";
/**
 * Error properties are using values from
 * https://tools.ietf.org/html/rfc7807
 */
Object.defineProperty(exports, "__esModule", { value: true });
exports.InternalServerError = exports.UnprocessableEntityError = exports.UnauthorizedError = exports.BadRequestError = void 0;
class DomainError extends Error {
    constructor(message, type, status, instance, detail, invalidParams) {
        super(message);
        this.name = this.constructor.name;
        this.data = {
            type,
            title: message,
            status,
            instance,
            detail: detail ?? "",
            invalid_params: invalidParams ?? [],
        };
        Error.captureStackTrace(this, this.constructor);
    }
}
class BadRequestError extends DomainError {
    constructor(instance, errors) {
        super("Your request parameters didn't validate.", "bad_request", 400, instance, "", errors);
    }
}
exports.BadRequestError = BadRequestError;
class UnauthorizedError extends DomainError {
    constructor(instance, detail) {
        super("Unathorized", "unathorized", 401, instance, detail);
    }
}
exports.UnauthorizedError = UnauthorizedError;
class UnprocessableEntityError extends DomainError {
    constructor(instance, detail) {
        super("Unprocessable Entity", "unprocessable_entity", 422, instance, detail);
    }
}
exports.UnprocessableEntityError = UnprocessableEntityError;
class InternalServerError extends DomainError {
    constructor(instance, detail) {
        super("Internal server error", "internal_server_error", 500, instance, detail);
    }
}
exports.InternalServerError = InternalServerError;
