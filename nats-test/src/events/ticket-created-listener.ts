import type { Message } from "node-nats-streaming";
import { Listener } from "./base-listener.js";
import type { TicketCreatedEvent } from "./ticket-created-event.js";
import { Subjects } from "./subjects.js";

export class TicketCreatedListener extends Listener<TicketCreatedEvent> {
  subject: Subjects.TicketCreated = Subjects.TicketCreated;
  queueGroupName = "payments-service";
  onMessage(data: TicketCreatedEvent["data"], msg: Message): void {
    console.log("Ticket created:", data);
    msg.ack();
  }
}
