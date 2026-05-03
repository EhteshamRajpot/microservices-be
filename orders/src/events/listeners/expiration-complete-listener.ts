import { Listener, Subjects, type ExpirationCompleteEvent, OrderStatus } from "devnexus-microservices-common";
import { Message } from "node-nats-streaming";
import { queueGroupName } from "./queue-group-name.js";
import { Order } from "../../models/order.js";
import { OrderCancelledPublisher } from "../publishers/order-cancelled-publisher.js";
import { natsWrapper } from "../../nats-wrapper.js";

export class ExpirationCompleteListener extends Listener<ExpirationCompleteEvent> {
  subject: Subjects.ExpirationComplete = Subjects.ExpirationComplete;
  queueGroupName = queueGroupName;

  async onMessage(data: ExpirationCompleteEvent["data"], msg: Message) {
    const order = await Order.findById(data.orderId)
    if (!order) {
      throw new Error("Order not found");
    }
    if (order.status === OrderStatus.Complete) {
      return msg.ack();
    }
    order.set({
      status: OrderStatus.Cancelled,
    });
    await order.save();
    await new OrderCancelledPublisher(natsWrapper.client).publish({
      id: order._id.toString(),
      userId: order.userId,
      status: order.status as OrderStatus,
      expiresAt: order.expiresAt.toISOString(),
      ticket: { id: order.ticket._id.toString(), price: order.ticket.price },
      version: order.version + 1,
    });
    await msg.ack();
  }
}