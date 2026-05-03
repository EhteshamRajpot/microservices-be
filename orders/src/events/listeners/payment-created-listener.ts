import { Listener, Subjects, type PaymentCreatedEvent } from "devnexus-microservices-common";
import { Message } from "node-nats-streaming";
import { queueGroupName } from "./queue-group-name.js";
import { Order } from "../../models/order.js";

export class PaymentCreatedListener extends Listener<PaymentCreatedEvent> {
  subject: Subjects.PaymentCreated = Subjects.PaymentCreated;
  queueGroupName = queueGroupName;

  async onMessage(data: PaymentCreatedEvent["data"], msg: Message) {
    const order = await Order.findById(data.orderId);
  }
}

export { PaymentCreatedListener };