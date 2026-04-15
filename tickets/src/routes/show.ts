import express, { type Request, type Response } from "express";
import { Ticket } from "../models/ticket.js";
import { NotFoundError } from "devnexus-microservices-common";

const router = express.Router();

router.get("/api/tickets/:id", async (req: Request, res: Response) => {
  const ticket = await Ticket.findById(req.params.id);
  if (!ticket) {
    throw new NotFoundError();
  }
  res.send(ticket);
});

export { router as showTicketRouter };