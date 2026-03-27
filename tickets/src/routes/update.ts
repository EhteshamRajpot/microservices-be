import express, { type Request, type Response } from "express";
import { body } from "express-validator";
import { NotAuthorizedError, NotFoundError, requireAuth, validateRequest } from "@devnexus_microservices/common";
import { Ticket } from "../models/ticket.js";

const router = express.Router();

router.put("/api/tickets/:id", requireAuth as any, [body("title").not().isEmpty().withMessage("Title is required"), body("price").isFloat({ gt: 0 }).withMessage("Price must be greater than 0")], validateRequest as any, async (req: Request, res: Response) => {
  const ticket = await Ticket.findById(req.params.id);
  if (!ticket) {
    throw new NotFoundError();
  }
  if (ticket.userId !== req.currentUser!.id) {
    throw new NotAuthorizedError();
  }
  ticket.set({
    title: req.body.title,
    price: req.body.price,
  });
  await ticket.save();
  res.send(ticket);
});

export { router as updateTicketRouter };