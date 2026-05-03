import {
  Listener,
  Subjects,
  type OrderCreatedEvent,
} from "devnexus-microservices-common";
import { Ticket } from "../../models/ticket.js";
import type { Message } from "node-nats-streaming";
import { queueGroupName } from "./queue-group-name.js";
import { natsWrapper } from "../../nats-wrapper.js";
import { TicketUpdatedPublisher } from "../publishers/ticket-updated-publisher.js";

export class OrderCreatedListener extends Listener<OrderCreatedEvent> {
  subject: Subjects.OrderCreated = Subjects.OrderCreated;
  queueGroupName = queueGroupName;

  async onMessage(data: OrderCreatedEvent["data"], msg: Message) {
    const ticket = await Ticket.findById(data.ticket.id);
    if (!ticket) {
      throw new Error("Ticket not found");
    }
    ticket.set({
      orderId: data.id,
    });
    await ticket.save();
    new TicketUpdatedPublisher(natsWrapper.client).publish({
      id: ticket.id,
      title: ticket.title,
      price: ticket.price,
      userId: ticket.userId,
      version: ticket.version,
      orderId: data.id,
    });
    msg.ack();
  }
}
