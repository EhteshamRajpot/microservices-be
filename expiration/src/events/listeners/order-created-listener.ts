import {
  Listener,
  Subjects,
  type OrderCreatedEvent,
} from "devnexus-microservices-common";
import { Message } from "node-nats-streaming";
import { queueGroupName } from "./queue-group-name.js";
import { expirationQueue } from "../../queues/expiration-queue.js";

export class OrderCreatedListener extends Listener<OrderCreatedEvent> {
  subject: Subjects.OrderCreated = Subjects.OrderCreated;
  queueGroupName = queueGroupName;

  async onMessage(data: OrderCreatedEvent["data"], msg: Message) {
    await expirationQueue.add(
      {
        orderId: data.id,
      },
      {
        delay: new Date(data.expiresAt).getTime() - new Date().getTime(),
      }
    );
    msg.ack();
  }
}
