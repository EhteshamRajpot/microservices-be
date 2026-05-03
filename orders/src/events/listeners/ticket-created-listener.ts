import {
  Listener,
  Subjects,
  type TicketCreatedEvent,
} from "devnexus-microservices-common";
import { Ticket } from "../../models/ticket.js";
import type { Message } from "node-nats-streaming";
import { queueGroupName } from "./queue-group-name.js";

export class TicketCreatedListener extends Listener<TicketCreatedEvent> {
  subject: Subjects.TicketCreated = Subjects.TicketCreated;
  queueGroupName = queueGroupName;

  async onMessage(data: TicketCreatedEvent["data"], msg: Message) {
    const { id, title, price, userId, version } = data;
    const existing = await Ticket.findById(id);
    if (existing) {
      msg.ack();
      return;
    }
    const ticket = Ticket.build({
      _id: id,
      title,
      price,
      userId,
      version,
    });
    await ticket.save();
    msg.ack();
  }
}
