import { Listener, Subjects, type OrderCancelledEvent, type TicketUpdatedEvent } from "devnexus-microservices-common";
import { Ticket } from "../../models/ticket.js";
import type { Message } from "node-nats-streaming";
import { queueGroupName } from "./queue-group-name.js";
import { TicketUpdatedPublisher } from "../publishers/ticket-updated-publisher.js";
import { natsWrapper } from "../../nats-wrapper.js";

export class OrderCancelledListener extends Listener<OrderCancelledEvent> {
  subject: Subjects.OrderCancelled = Subjects.OrderCancelled;
  queueGroupName = queueGroupName;

  async onMessage(data: OrderCancelledEvent["data"], msg: Message) {
    const ticket = await Ticket.findById(data.ticket.id);
    if (!ticket) {
      throw new Error("Ticket not found");
    }
    ticket.set({
      orderId: undefined as unknown as string,
    });
    await ticket.save();
    new TicketUpdatedPublisher(natsWrapper.client).publish({
      id: ticket.id,
      title: ticket.title,
      price: ticket.price,
      userId: ticket.userId,
      version: ticket.version,
      orderId: ticket.orderId,
    } as TicketUpdatedEvent);
    msg.ack();
  }
}