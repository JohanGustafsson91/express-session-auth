import express, { Request, Response } from "express";
import { userToSession } from "utils/userToSession";
import { User, UserModel } from "models";
import { BadRequestError, sendErrorAsHttpResponse } from "errors";
import Joi from "joi";
import { validation } from "validation";

const userRouter = express.Router();

userRouter.post("", async (req: Request, res: Response) => {
  try {
    const { firstName, lastName, email, password }: User = req.body;
    const userData = { firstName, lastName, email, password };

    const validation = postSchema.validate(userData);
    if (validation.error)
      throw new BadRequestError(req.baseUrl, validation.error.details);

    const newUser = new UserModel(userData);
    await newUser.save();

    const sessionUser = userToSession(newUser);
    req.session.user = sessionUser;

    return res.status(201).json(sessionUser);
  } catch (error) {
    return sendErrorAsHttpResponse(req, res, error);
  }
});

export { userRouter };

const postSchema = Joi.object({
  firstName: validation.firstName,
  lastName: validation.lastName,
  password: validation.password,
  email: validation.email,
});
