"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.userRouter = void 0;
const express_1 = __importDefault(require("express"));
const userToSession_1 = require("utils/userToSession");
const models_1 = require("models");
const errors_1 = require("errors");
const joi_1 = __importDefault(require("joi"));
const validation_1 = require("validation");
const userRouter = express_1.default.Router();
exports.userRouter = userRouter;
userRouter.post("", async (req, res) => {
    try {
        const { firstName, lastName, email, password } = req.body;
        const validation = postSchema.validate({
            firstName,
            lastName,
            email,
            password,
        });
        if (validation.error) {
            throw new errors_1.BadRequestError(req.baseUrl, validation.error.details);
        }
        const newUser = new models_1.UserModel({ firstName, lastName, email, password });
        await newUser.save();
        const sessionUser = userToSession_1.userToSession(newUser);
        req.session.user = sessionUser;
        return res.status(200).json(sessionUser);
    }
    catch (error) {
        return errors_1.sendErrorAsHttpResponse(req, res, error);
    }
});
const postSchema = joi_1.default.object({
    firstName: validation_1.validation.firstName,
    lastName: validation_1.validation.lastName,
    password: validation_1.validation.password,
    email: validation_1.validation.email,
});
