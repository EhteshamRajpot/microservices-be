import {
  Listener,
  Subjects,
  type TicketCreatedEvent,
} from "devnexus-microservices-common";
import { Ticket } from "../../models/ticket.js";
import { Message } from "node-nats-streaming";
import { queueGroupName } from "./queue-group-name.js";

export class TicketCreatedListener extends Listener<TicketCreatedEvent> {
  subject: Subjects.TicketCreated = Subjects.TicketCreated;
  queueGroupName = queueGroupName;

  async onMessage(data: TicketCreatedEvent["data"], msg: Message) {
    const { id, title, price, userId } = data;
    const ticket = Ticket.build({
      title,
      price,
      userId,
      version: 0,
    });
    await ticket.save();
    msg.ack();
  }
}
