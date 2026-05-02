import express, { type Request, type Response } from "express";
import {
  BadRequestError,
  NotFoundError,
  OrderStatus,
  requireAuth,
  Subjects,
  validateRequest,
} from "devnexus-microservices-common";
import { body } from "express-validator";
import { Ticket } from "../models/ticket.js";
import { Order } from "../models/order.js";
import { OrderCreatedPublisher } from "../events/publishers/order-created-publisher.js";
import { natsWrapper } from "../nats-wrapper.js";

const router = express.Router();

const EXPIRATION_WINDOW_SECONDS = 15 * 60;

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
    const isReserved = await ticket.isReserved();
    if (isReserved) {
      throw new BadRequestError("Ticket is already reserved");
    }

    const expiration = new Date();
    expiration.setSeconds(expiration.getSeconds() + EXPIRATION_WINDOW_SECONDS);
    const order = Order.build({
      userId: req.currentUser!.id,
      status: OrderStatus.Created,
      expiresAt: expiration,
      ticket,
      version: ticket.get("version") as number,
    });
    await order.save();

    new OrderCreatedPublisher(natsWrapper.client).publish({
      id: order._id.toString(),
      userId: order.userId,
      status: order.status as OrderStatus,
      expiresAt: order.expiresAt.toISOString(),
      ticket: { id: order.ticket._id.toString(), price: order.ticket.price },
      version: order.version + 1,
    });
    res.send(order);
  }
);

export { router as newOrderRouter };
