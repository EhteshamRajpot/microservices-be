import { Publisher, Subjects, type PaymentCreatedEvent } from "devnexus-microservices-common";

export class PaymentCreatedPublisher extends Publisher<PaymentCreatedEvent> {
  subject: Subjects.PaymentCreated = Subjects.PaymentCreated;
}