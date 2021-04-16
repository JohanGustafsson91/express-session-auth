"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const helmet_1 = __importDefault(require("helmet"));
const dotenv_1 = __importDefault(require("dotenv"));
const mongoose_1 = __importDefault(require("mongoose"));
const express_session_1 = __importDefault(require("express-session"));
const connect_mongo_1 = __importDefault(require("connect-mongo"));
const routes_1 = require("routes");
const errors_1 = require("errors");
dotenv_1.default.config();
const { PORT, NODE_ENV, MONGO_URI, SESSION_NAME, SESSION_SECRET, SESSION_LIFETIME, } = process.env;
(async function startServer() {
    try {
        if (!PORT) {
            throw new errors_1.InternalServerError("Missing port", "startServer()");
        }
        if (!MONGO_URI) {
            throw new errors_1.InternalServerError("Missing mongo uri", "startServer()");
        }
        await mongoose_1.default.connect(MONGO_URI, {
            useNewUrlParser: true,
            useUnifiedTopology: true,
        });
        const app = express_1.default();
        app.use(helmet_1.default());
        app.disable("x-powered-by");
        app.use(express_1.default.json());
        app.use(express_1.default.urlencoded({ extended: true }));
        app.use(express_session_1.default({
            name: SESSION_NAME,
            secret: SESSION_SECRET,
            saveUninitialized: false,
            resave: false,
            store: connect_mongo_1.default.create({
                mongoUrl: MONGO_URI,
                collectionName: "session",
                ttl: parseInt(SESSION_LIFETIME) / 1000,
            }),
            cookie: {
                sameSite: true,
                secure: NODE_ENV === "production",
                maxAge: parseInt(SESSION_LIFETIME),
            },
        }));
        const apiRouter = express_1.default.Router();
        app.use("/api", apiRouter);
        apiRouter.use("/users", routes_1.userRouter);
        apiRouter.use("/sessions", routes_1.sessionRouter);
        app.listen(PORT, () => console.log(`Running on ${PORT} in ${NODE_ENV}`));
    }
    catch (error) {
        console.log("Error starting server:\n");
        console.log(error);
    }
})();
