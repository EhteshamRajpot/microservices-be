import express, { type Request, type Response } from "express";
import { body } from "express-validator";
import { BadRequestError, NotAuthorizedError, NotFoundError, requireAuth, validateRequest } from "devnexus-microservices-common";
import { Ticket } from "../models/ticket.js";
import { TicketUpdatedPublisher } from "../events/publishers/ticket-updated-publisher.js";
import { natsWrapper } from "../nats-wrapper.js";

const router = express.Router();

router.put("/api/tickets/:id", requireAuth as any, [body("title").not().isEmpty().withMessage("Title is required"), body("price").isFloat({ gt: 0 }).withMessage("Price must be greater than 0")], validateRequest as any, async (req: Request, res: Response) => {
  const ticket = await Ticket.findById(req.params.id);
  console.log('Updating ticket...', {id: req.params.id, ticket});
  if (!ticket) {
    throw new NotFoundError();
  }

  if (ticket.orderId) {
    throw new BadRequestError("Cannot edit a reserved ticket");
  }
  if (ticket.userId !== req.currentUser!.id) {
    throw new NotAuthorizedError();
  }
  ticket.set({
    title: req.body.title,
    price: req.body.price,
  });
  await ticket.save();
  new TicketUpdatedPublisher(natsWrapper.client).publish({
    id: ticket._id.toString(),
    title: ticket.title,
    price: ticket.price,
    userId: ticket.userId,
  });
  res.send(ticket);
});

export { router as updateTicketRouter };