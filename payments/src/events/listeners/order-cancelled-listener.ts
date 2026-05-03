import { Listener, OrderStatus, Subjects, type OrderCancelledEvent } from "devnexus-microservices-common";
import { queueGroupName } from "./queue-group-name.js";
import { Order } from "../../models/order.js";

/** Enough for manual ack; avoids importing `Message` from CJS `node-nats-streaming` under native ESM. */
type AckableMsg = { ack(): void };

export class OrderCancelledListener extends Listener<OrderCancelledEvent> {
  subject: Subjects.OrderCancelled = Subjects.OrderCancelled;
  queueGroupName = queueGroupName;

  async onMessage(data: OrderCancelledEvent["data"], msg: AckableMsg) {
    const order = await Order.findById(data.id);
    if (!order) {
      throw new Error("Order not found");
    }
    order.set({
      status: OrderStatus.Cancelled,
    });
    await order.save();
    msg.ack();
  }
}