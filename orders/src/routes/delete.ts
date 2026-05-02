import express, { type Request, type Response } from "express";
import { NotAuthorizedError, NotFoundError, OrderStatus, requireAuth } from "devnexus-microservices-common";
import { Order } from "../models/order.js";
import { OrderCancelledPublisher } from "../events/publishers/order-cancelled-publisher.js";
import { natsWrapper } from "../nats-wrapper.js";
const router = express.Router();

router.delete("/api/orders/:orderId", requireAuth as any, async (req: Request, res: Response) => {
  const order = await Order.findById(req.params.orderId).populate("ticket");
  if (!order) {
    throw new NotFoundError();
  }
  if (order.userId !== req.currentUser!.id) {
    throw new NotAuthorizedError();
  }
  order.status = OrderStatus.Cancelled;
  await order.save();

  new OrderCancelledPublisher(natsWrapper.client).publish({
    id: order._id.toString(),
    userId: order.userId,
    status: order.status as OrderStatus,
    expiresAt: order.expiresAt.toISOString(),
    ticket: { id: order.ticket._id.toString(), price: order.ticket.price },
    version: order.version + 1,
  });

  res.send(order);
});
  
export { router as deleteOrderRouter };