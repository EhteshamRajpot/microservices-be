import express from "express";
import "express-async-errors";
import cors from "cors";
import cookieSession from "cookie-session";

const app = express();

import { currentUser, errorHandler, NotFoundError } from "devnexus-microservices-common";
import { indexOrderRouter } from "./routes/index.js";
import { newOrderRouter } from "./routes/new.js";
import { showOrderRouter } from "./routes/show.js";
import { deleteOrderRouter } from "./routes/delete.js";

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

app.use(currentUser as any);

app.use(newOrderRouter);
app.use(showOrderRouter);
app.use(indexOrderRouter);
app.use(deleteOrderRouter);

app.all("*", async (req, res, next) => {
  //   next(new NotFoundError());
  throw new NotFoundError();
});

app.use(errorHandler as any);

export { app };
