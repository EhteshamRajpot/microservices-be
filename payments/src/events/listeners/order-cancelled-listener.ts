import { Listener, OrderStatus, Subjects, type OrderCancelledEvent } from "devnexus-microservices-common";
import { Message } from "node-nats-streaming";
import { queueGroupName } from "./queue-group-name.js";
import { Order } from "../../models/order.js";

export class OrderCancelledListener extends Listener<OrderCancelledEvent> {
  subject: Subjects.OrderCancelled = Subjects.OrderCancelled;
  queueGroupName = queueGroupName;

  async onMessage(data: OrderCancelledEvent["data"], msg: Message) {
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