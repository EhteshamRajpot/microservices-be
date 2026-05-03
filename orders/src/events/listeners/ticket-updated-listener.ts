import { Listener, Subjects, type TicketUpdatedEvent } from "devnexus-microservices-common";
import { Ticket } from "../../models/ticket.js";
import type { Message } from "node-nats-streaming";
import { queueGroupName } from "./queue-group-name.js";

export class TicketUpdatedListener extends Listener<TicketUpdatedEvent> {
  subject: Subjects.TicketUpdated = Subjects.TicketUpdated;
  queueGroupName = queueGroupName;

  async onMessage(data: TicketUpdatedEvent["data"], msg: Message) {
    const { id, title, price, userId, version: newVersion } = data;
    const ticket = await Ticket.findById(id);
    if (!ticket) {
      // ticket:updated can arrive before ticket:created finishes; skip ack so NATS redelivers.
      console.warn(
        `TicketUpdatedListener: ticket ${id} not found yet; will retry after ticket:created`
      );
      return;
    }

    const currentVersion = ticket.get("version") as number;

    // Tickets service sends version *after* its save. Replica should be one behind;
    // updateIfCurrentPlugin bumps `newVersion - 1` → `newVersion` on save.
    if (currentVersion === newVersion) {
      msg.ack();
      return;
    }
    if (currentVersion > newVersion) {
      msg.ack();
      return;
    }
    if (currentVersion !== newVersion - 1) {
      console.error(
        `TicketUpdatedListener: version gap ticket=${id} local=${currentVersion} event=${newVersion}`
      );
      return;
    }

    ticket.set({
      title,
      price,
      ...(userId !== undefined ? { userId } : {}),
      version: newVersion - 1,
    });
    await ticket.save();
    msg.ack();
  }
}