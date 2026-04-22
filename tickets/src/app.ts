import express from "express";
import "express-async-errors";
import cors from "cors";
import cookieSession from "cookie-session";

const app = express();

import { currentUser, errorHandler, NotFoundError } from "devnexus-microservices-common";
import { indexTicketRouter } from "../../tickets/src/routes/index.js";
import { newTicketRouter } from "../../tickets/src/routes/new.js";
import { showTicketRouter } from "../../tickets/src/routes/show.js";
import { updateTicketRouter } from "../../tickets/src/routes/update.js";

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

app.use(newTicketRouter);
app.use(showTicketRouter);
app.use(indexTicketRouter);
app.use(updateTicketRouter);

app.all("*", async (req, res, next) => {
  //   next(new NotFoundError());
  throw new NotFoundError();
});

app.use(errorHandler as any);

export { app };
