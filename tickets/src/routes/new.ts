import express, { type Request, type Response } from "express";
import { body } from "express-validator";
import { requireAuth, validateRequest } from "devnexus-microservices-common";
import { Ticket } from "../models/ticket.js";
import { TicketCreatedPublisher } from "../events/publishers/ticket-created-publisher.js";
import { natsWrapper } from "../nats-wrapper.js";

const router = express.Router();

router.post(
  "/api/tickets",
  requireAuth as any,
  [body("title").not().isEmpty().withMessage("Title is required")],
  validateRequest as any,
  async (req: Request, res: Response) => {
    const { title, price } = req.body;
    const ticket = Ticket.build({
      title,
      price,
      userId: req.currentUser!.id,
    });
    await ticket.save();
    new TicketCreatedPublisher(natsWrapper.client).publish({
      id: ticket._id.toString(),
      title: ticket.title,
      price: ticket.price,
      userId: ticket.userId,
      version: ticket.version,
    });
    res.status(201).send(ticket);
  }
);

export { router as newTicketRouter };
