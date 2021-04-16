import { compareSync } from "bcryptjs";
import express, { Request, Response } from "express";
import { userToSession } from "utils/userToSession";
import { UserModel } from "models";
import {
  BadRequestError,
  sendErrorAsHttpResponse,
  UnauthorizedError,
  UnprocessableEntityError,
} from "errors";
import Joi from "joi";
import { validation } from "validation";

const sessionRouter = express.Router();

sessionRouter.post("", async (req: Request, res: Response) => {
  try {
    const { email, password } = req.body;
    const sessionData = { email, password };

    const validation = postSchema.validate(sessionData);
    if (validation.error)
      throw new BadRequestError(req.baseUrl, validation.error.details);

    const user = await UserModel.findOne({ email });
    if (!user || !compareSync(password, user.password))
      throw new UnauthorizedError(req.baseUrl, "Invalid login credentials");

    const sessionUser = userToSession(user);
    req.session.user = sessionUser;

    return res.status(201).json(sessionUser);
  } catch (error) {
    return sendErrorAsHttpResponse(req, res, error);
  }
});

sessionRouter.delete("", async (req: Request, res: Response) => {
  try {
    const user = req.session.user;
    if (!user) throw new UnprocessableEntityError(req.baseUrl);

    req.session.destroy((error) => {
      if (error) throw error;
      res.clearCookie(process.env.SESSION_NAME as string);
      return res.status(200).json(user);
    });
  } catch (error) {
    return sendErrorAsHttpResponse(req, res, error);
  }
});

sessionRouter.get("", async (req: Request, res: Response) => {
  res.status(200).json({ ...req.session.user });
});

export { sessionRouter };

const postSchema = Joi.object({
  password: validation.password,
  email: validation.email,
});
