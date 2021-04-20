/**
 * Error properties are using values from
 * https://tools.ietf.org/html/rfc7807
 */

import { ValidationErrorItem } from "joi";

class DomainError extends Error {
  data: Data;

  constructor(
    message: Data["title"],
    type: Data["type"],
    status: Data["status"],
    instance: Data["instance"],
    detail?: Data["detail"],
    invalidParams?: Data["invalid_params"]
  ) {
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

export class BadRequestError extends DomainError {
  constructor(instance: Data["instance"], errors: Data["invalid_params"]) {
    super(
      "Your request parameters didn't validate.",
      "bad_request",
      400,
      instance,
      "",
      errors
    );
  }
}

export class UnauthorizedError extends DomainError {
  constructor(instance: Data["instance"], detail: Data["detail"]) {
    super("Unathorized", "unathorized", 401, instance, detail);
  }
}

export class UnprocessableEntityError extends DomainError {
  constructor(instance: Data["instance"], detail?: Data["detail"]) {
    super(
      "Unprocessable Entity",
      "unprocessable_entity",
      422,
      instance,
      detail
    );
  }
}

export class InternalServerError extends DomainError {
  constructor(instance: Data["instance"], detail: Data["detail"]) {
    super(
      "Internal server error",
      "internal_server_error",
      500,
      instance,
      detail
    );
  }
}

export interface Data {
  type: ErrorType;
  title: string;
  status: number;
  instance: string;
  detail?: string;
  invalid_params?: ValidationErrorItem[];
}

type ErrorType =
  | "bad_request"
  | "unathorized"
  | "unprocessable_entity"
  | "internal_server_error";
