import { sendErrorAsHttpResponse, UnauthorizedError } from "errors";
import { NextFunction, Request, Response } from "express";

export const authorized = (req: Request, res: Response, next: NextFunction) => {
  if (!req.session.user) {
    const error = new UnauthorizedError(req.baseUrl, "");
    return sendErrorAsHttpResponse(req, res, error);
  }

  next();
};
