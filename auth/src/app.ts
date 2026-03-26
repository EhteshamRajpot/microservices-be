import express from "express";
import "express-async-errors";
import cors from "cors";
import cookieSession from "cookie-session";

const app = express();

import { currentUserRouter } from "./routes/current-user.js";
import { signinRouter } from "./routes/signin.js";
import { signoutRouter } from "./routes/signout.js";
import { signupRouter } from "./routes/signup.js";
import { errorHandler, NotFoundError } from "@devnexus_microservices/common";

// CORS: allow browser requests from client (localhost:3000) and ticketing.dev
app.use(
  cors({
    origin: ["http://localhost:3000", "https://ticketing.dev", "http://ticketing.dev"],
    credentials: true,
  })
);

// Middleware
app.use(express.json());
app.set("trust proxy", true);
app.use(
  cookieSession({
    signed: false,
    // secure: false,
    secure: process.env.NODE_ENV !== "test",
  })
);

app.use(currentUserRouter);
app.use(signinRouter);
app.use(signoutRouter);
app.use(signupRouter);

app.all("*", async (req, res, next) => {
  //   next(new NotFoundError());
  throw new NotFoundError();
});

app.use(errorHandler as any);

export { app };
