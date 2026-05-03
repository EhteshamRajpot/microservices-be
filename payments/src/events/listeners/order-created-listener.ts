import { Listener, OrderStatus, Subjects, type OrderCreatedEvent } from "devnexus-microservices-common";
import { queueGroupName } from "./queue-group-name.js";
import { Order } from "../../models/order.js";

/** Enough for manual ack; avoids importing `Message` from CJS `node-nats-streaming` under native ESM. */
type AckableMsg = { ack(): void };

export class OrderCreatedListener extends Listener<OrderCreatedEvent> {
  subject: Subjects.OrderCreated = Subjects.OrderCreated;
  queueGroupName = queueGroupName;

  async onMessage(data: OrderCreatedEvent["data"], msg: AckableMsg) {
    const order = Order.build({
      id: data.id,
      userId: data.userId,
      status: data.status as OrderStatus,
      price: data.ticket.price,
      version: data.version,
    });
    await order.save();
    msg.ack();
  }
}