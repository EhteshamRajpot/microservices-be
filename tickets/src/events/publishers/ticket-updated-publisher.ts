import {
  Publisher,
  Subjects,
  type TicketUpdatedEvent,
} from "devnexus-microservices-common";

export class TicketUpdatedPublisher extends Publisher<TicketUpdatedEvent> {
  subject: Subjects.TicketUpdated = Subjects.TicketUpdated;
}