import { Publisher } from "./base-publisher.js";
import type { TicketCreatedEvent } from "./ticket-created-event.js";
import { Subjects } from "./subjects.js";

export class TicketCreatedPublisher extends Publisher<TicketCreatedEvent> {
  subject: Subjects.TicketCreated = Subjects.TicketCreated;
}