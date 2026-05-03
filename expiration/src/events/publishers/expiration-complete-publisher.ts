import { Publisher, Subjects, type ExpirationCompleteEvent } from "devnexus-microservices-common";

export class ExpirationCompletePublisher extends Publisher<ExpirationCompleteEvent> {
  subject: Subjects.ExpirationComplete = Subjects.ExpirationComplete;
}