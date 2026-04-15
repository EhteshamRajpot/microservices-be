import {
  Subjects,
  Publisher,
  type TicketCreatedEvent,
} from "devnexus-microservices-common";

export class TicketCreatedPublisher extends Publisher<TicketCreatedEvent> {
  subject: Subjects.TicketCreated = Subjects.TicketCreated;
}
