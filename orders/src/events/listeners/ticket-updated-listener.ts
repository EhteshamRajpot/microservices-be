import { Listener, Subjects, type TicketUpdatedEvent } from "devnexus-microservices-common";
import { Ticket } from "../../models/ticket.js";
import { Message } from "node-nats-streaming";
import { queueGroupName } from "./queue-group-name.js";

export class TicketUpdatedListener extends Listener<TicketUpdatedEvent> {
  subject: Subjects.TicketUpdated = Subjects.TicketUpdated;
  queueGroupName = queueGroupName;

  async onMessage(data: TicketUpdatedEvent["data"], msg: Message) {
    const { id, title, price, userId, version } = data;
    const ticket = await Ticket.findById(id);
    if (!ticket) {
      throw new Error("Ticket not found");
    }
    if (ticket.get("version") !== version) {
      throw new Error("Version mismatch");
    }
    ticket.set({
      title,
      price,
      userId,
      version: version + 1,
    });
    await ticket.save();
    msg.ack();
  }
}