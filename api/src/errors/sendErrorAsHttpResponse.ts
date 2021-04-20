import { Request, Response } from "express";
import {
  BadRequestError,
  Data,
  InternalServerError,
  UnauthorizedError,
  UnprocessableEntityError,
} from "errors";

export const sendErrorAsHttpResponse = (
  req: Request,
  res: Response,
  error: Error
) => {
  const knownError = knownErrors.some(
    (knownError) => error instanceof knownError
  );

  if (!knownError) {
    const internalError = new InternalServerError(req.baseUrl, error.message);
    return res.status(internalError.data.status).json(internalError);
  }

  const castedError = (error as unknown) as { data: Data };
  return res.status(castedError.data.status).json(castedError);
};

const knownErrors = [
  BadRequestError,
  UnauthorizedError,
  UnprocessableEntityError,
];
