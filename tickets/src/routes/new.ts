import express, { type Request, type Response } from "express";
import { body } from "express-validator";
import { requireAuth, validateRequest } from "@devnexus_microservices/common";
import { Ticket } from "../models/ticket.js";

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
    res.status(201).send(ticket);
  }
);

export { router as newTicketRouter };
