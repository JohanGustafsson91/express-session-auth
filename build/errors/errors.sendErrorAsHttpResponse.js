"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.sendErrorAsHttpResponse = void 0;
const errors_1 = require("errors");
const sendErrorAsHttpResponse = (req, res, error) => {
    const knownError = knownErrors.some((knownError) => error instanceof knownError);
    if (!knownError)
        return sendInternalErrorAsHttpResponse(req, res, error);
    const castedError = error; // TODO inherit DomainError
    return res.status(castedError.data.status).json(castedError);
};
exports.sendErrorAsHttpResponse = sendErrorAsHttpResponse;
const sendInternalErrorAsHttpResponse = (req, res, error) => {
    const internalError = new errors_1.InternalServerError(req.baseUrl, error.message);
    return res.status(internalError.data.status).json(internalError);
};
const knownErrors = [
    errors_1.BadRequestError,
    errors_1.UnauthorizedError,
    errors_1.UnprocessableEntityError,
];
