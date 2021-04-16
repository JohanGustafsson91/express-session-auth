import express, { Express } from "express";
import helmet from "helmet";
import dotenv from "dotenv";
import mongoose from "mongoose";
import cors from "cors";
import session from "express-session";
import MongoStore from "connect-mongo";

import { userRouter, sessionRouter } from "routes";
import { InternalServerError } from "errors";

dotenv.config();
const {
  PORT,
  NODE_ENV,
  MONGO_URI,
  SESSION_NAME,
  SESSION_SECRET,
  SESSION_LIFETIME,
} = (process.env as unknown) as Record<string, string>;

(async function startServer() {
  try {
    if (!PORT) {
      throw new InternalServerError("Missing port", "startServer()");
    }

    if (!MONGO_URI) {
      throw new InternalServerError("Missing mongo uri", "startServer()");
    }

    await mongoose.connect(MONGO_URI, {
      useNewUrlParser: true,
      useUnifiedTopology: true,
    });

    const app: Express = express();

    app.use(helmet());
    app.disable("x-powered-by");
    app.use(express.json());
    app.use(express.urlencoded({ extended: true }));
    app.use(cors());

    app.use(
      session({
        name: SESSION_NAME,
        secret: SESSION_SECRET,
        saveUninitialized: false,
        resave: false,
        store: MongoStore.create({
          mongoUrl: MONGO_URI,
          collectionName: "session",
          ttl: parseInt(SESSION_LIFETIME) / 1000,
        }),
        cookie: {
          sameSite: true,
          secure: NODE_ENV === "production",
          maxAge: parseInt(SESSION_LIFETIME),
        },
      })
    );

    const apiRouter = express.Router();
    app.use("/api", apiRouter);
    apiRouter.use("/users", userRouter);
    apiRouter.use("/sessions", sessionRouter);

    app.listen(PORT, () => console.log(`Running on ${PORT} in ${NODE_ENV}`));
  } catch (error) {
    console.log("Error starting server:\n");
    console.log(error);
  }
})();

declare module "express-session" {
  export interface SessionData {
    user: { [key: string]: any };
  }
}
