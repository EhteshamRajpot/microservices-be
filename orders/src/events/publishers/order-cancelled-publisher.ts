import { Publisher, Subjects, type OrderCancelledEvent } from "devnexus-microservices-common";

export class OrderCancelledPublisher extends Publisher<OrderCancelledEvent> {
  subject: Subjects.OrderCancelled = Subjects.OrderCancelled;
} 
