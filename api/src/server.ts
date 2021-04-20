import express, { Express } from "express";
import helmet from "helmet";
import dotenv from "dotenv";
import mongoose from "mongoose";
import cors from "cors";
import session from "express-session";
import morgan from "morgan";
import MongoStore from "connect-mongo";

import { userRouter, sessionRouter } from "routes";
import { InternalServerError } from "errors";

dotenv.config();
import { config } from "config";

(async function startServer() {
  try {
    if (!config.server.PORT) {
      throw new InternalServerError("Missing port", "startServer()");
    }

    if (!config.database.MONGO_URI) {
      throw new InternalServerError("Missing mongo uri", "startServer()");
    }

    await mongoose.connect(config.database.MONGO_URI, {
      useNewUrlParser: true,
      useUnifiedTopology: true,
    });

    const app: Express = express();

    app.use(helmet());
    app.disable("x-powered-by");
    app.use(express.json());
    app.use(express.urlencoded({ extended: true }));
    app.use(cors());
    app.use(morgan("common"));

    app.use(
      session({
        name: config.server.SESSION_NAME,
        secret: config.server.SESSION_SECRET,
        saveUninitialized: false,
        resave: false,
        store: MongoStore.create({
          mongoUrl: config.database.MONGO_URI,
          collectionName: "session",
          ttl: parseInt(config.server.SESSION_LIFETIME) / 1000,
        }),
        cookie: {
          sameSite: true,
          secure: config.server.ENVIRONMENT === "production",
          maxAge: parseInt(config.server.SESSION_LIFETIME),
        },
      })
    );

    const apiRouter = express.Router();
    app.use("/api", apiRouter);
    apiRouter.use("/users", userRouter);
    apiRouter.use("/sessions", sessionRouter);

    app.listen(config.server.PORT, () =>
      console.log(
        `Running on ${config.server.PORT} in ${config.server.ENVIRONMENT}`
      )
    );
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
