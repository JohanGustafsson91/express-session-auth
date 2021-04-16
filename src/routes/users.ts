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
    const validation = postSchema.validate({
      firstName,
      lastName,
      email,
      password,
    });

    if (validation.error) {
      throw new BadRequestError(req.baseUrl, validation.error.details);
    }

    const newUser = new UserModel({ firstName, lastName, email, password });
    await newUser.save();

    const sessionUser = userToSession(newUser);
    req.session.user = sessionUser;

    return res.status(200).json(sessionUser);
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
