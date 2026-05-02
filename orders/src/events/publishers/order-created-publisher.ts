import {
  Publisher,
  Subjects,
  type OrderCreatedEvent,
} from "devnexus-microservices-common";

export class OrderCreatedPublisher extends Publisher<OrderCreatedEvent> {
   subject: Subjects.OrderCreated = Subjects.OrderCreated;
}