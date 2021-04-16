"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.sessionRouter = void 0;
const bcryptjs_1 = require("bcryptjs");
const express_1 = __importDefault(require("express"));
const userToSession_1 = require("utils/userToSession");
const models_1 = require("models");
const errors_1 = require("errors");
const joi_1 = __importDefault(require("joi"));
const validation_1 = require("validation");
const sessionRouter = express_1.default.Router();
exports.sessionRouter = sessionRouter;
sessionRouter.post("", async (req, res) => {
    try {
        const { email, password } = req.body;
        const validation = postSchema.validate({ email, password });
        if (validation.error) {
            throw new errors_1.BadRequestError(req.baseUrl, validation.error.details);
        }
        const user = await models_1.UserModel.findOne({ email });
        if (!user || !bcryptjs_1.compareSync(password, user.password)) {
            throw new errors_1.UnauthorizedError(req.baseUrl, "Invalid login credentials");
        }
        const sessionUser = userToSession_1.userToSession(user);
        req.session.user = sessionUser;
        return res.status(201).json(sessionUser);
    }
    catch (error) {
        return errors_1.sendErrorAsHttpResponse(req, res, error);
    }
});
sessionRouter.delete("", async (req, res) => {
    try {
        const user = req.session.user;
        if (!user) {
            throw new errors_1.UnprocessableEntityError(req.baseUrl);
        }
        req.session.destroy((error) => {
            if (error) {
                throw error;
            }
            res.clearCookie(process.env.SESSION_NAME);
            return res.status(200).json(user);
        });
    }
    catch (error) {
        return errors_1.sendErrorAsHttpResponse(req, res, error);
    }
});
sessionRouter.get("", async (req, res) => {
    res.status(200).json({ ...req.session.user });
});
const postSchema = joi_1.default.object({
    password: validation_1.validation.password,
    email: validation_1.validation.email,
});
