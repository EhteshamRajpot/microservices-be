import { Listener, OrderStatus, Subjects, type OrderCreatedEvent } from "devnexus-microservices-common";
import { Message } from "node-nats-streaming";
import { queueGroupName } from "./queue-group-name.js";
import { Order } from "../../models/order.js";

export class OrderCreatedListener extends Listener<OrderCreatedEvent> {
  subject: Subjects.OrderCreated = Subjects.OrderCreated;
  queueGroupName = queueGroupName;

  async onMessage(data: OrderCreatedEvent["data"], msg: Message) {
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