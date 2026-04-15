import { Subjects } from "./subjects.js";

export interface TicketCreatedEvent {
  subject: Subjects.TicketCreated;
  data: {
    id: "123";
    title: "concert";
    price: 10;
  };
}