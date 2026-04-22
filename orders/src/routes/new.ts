import express, { type Request, type Response } from "express";
import { NotFoundError, OrderStatus, requireAuth, validateRequest } from "devnexus-microservices-common";
import { body } from "express-validator";
import { Ticket } from "../models/ticket.js";
import { Order } from "../models/order.js";

const router = express.Router();

router.post(
  "/api/orders",
  requireAuth as any,
  [body("ticketId").not().isEmpty().withMessage("Ticket ID is required")],
  validateRequest as any,
  async (req: Request, res: Response) => {
    const { ticketId } = req.body;
    const ticket = await Ticket.findById(ticketId);
    if (!ticket) {
      throw new NotFoundError();
    }
    const order = Order.build({
      userId: req.currentUser!.id,
      status: OrderStatus.Created,
      expiresAt: new Date(Date.now() + 1000 * 60 * 15),
      ticket,
    });
    await order.save();
    res.send(order);
  }
);

export { router as newOrderRouter };
