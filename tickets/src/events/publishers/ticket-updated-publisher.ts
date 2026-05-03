import {
  Publisher,
  Subjects,
  type TicketUpdatedEvent,
} from "devnexus-microservices-common";
import { natsWrapper } from "../../nats-wrapper.js";

export class TicketUpdatedPublisher extends Publisher<TicketUpdatedEvent> {
  subject: Subjects.TicketUpdated = Subjects.TicketUpdated;
}
  
new TicketUpdatedPublisher(natsWrapper.client).publish({
  id: ticket.id,
  title: ticket.title,
  price: ticket.price,
  userId: ticket.userId,
  version: ticket.version,
  orderId: ticket.orderId,
});