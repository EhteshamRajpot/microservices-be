import nats from "node-nats-streaming";
import type { Message, Stan, SubscriptionOptions } from "node-nats-streaming";
import { randomBytes } from "crypto";

const natsUrl = process.env.NATS_URL || "nats://localhost:4222";

const stan = nats.connect("ticketing", randomBytes(4).toString("hex"), {
  url: natsUrl,
});

stan.on("error", (err) => {
  console.error("NATS connection error:", err.message);
  if (
    err.message.includes("Could not connect") ||
    (err as { code?: string }).code === "CONN_ERR"
  ) {
    console.error(
      "\nNothing is listening at the configured URL. From your machine to NATS in the cluster, run in another terminal:\n" +
        "  npm run port-forward:nats\n" +
        "Or: kubectl port-forward svc/nats-srv 4222:4222\n"
    );
  }
});

stan.on("connect", () => {
  console.log("Listener connected to NATS");

  stan.on("close", () => {
    console.log("NATS connection closed!");
    process.exit();
  });

  new TicketCreatedListener(stan).listen();

  const options = stan
    .subscriptionOptions()
    .setManualAckMode(true)
    .setDeliverAllAvailable()
    .setDurableName("accounting-service");
  const subscription = stan.subscribe(
    "ticket:created",
    "queue-group-name",
    options
  );

  subscription.on("message", (msg: Message) => {
    const data = msg.getData();
    if (typeof data === "string") {
      console.log(`Received event #${msg.getSequence()}, with data: ${data}`);
    }

    msg.ack();
  });
});

process.on("SIGINT", () => stan.close());
process.on("SIGTERM", () => stan.close());

abstract class Listener {
  abstract subject: string;
  abstract queueGroupName: string;
  abstract onMessage(data: any, msg: Message): void;
  private client: Stan;
  protected ackWait = 5 * 1000;

  constructor(client: Stan) {
    this.client = client;
  }

  subscriptionOptions() {
    return this.client
      .subscriptionOptions()
      .setDeliverAllAvailable()
      .setManualAckMode(true)
      .setAckWait(this.ackWait)
      .setDurableName(this.queueGroupName);
  }

  listen() {
    const subscription = this.client.subscribe(
      this.subject,
      this.queueGroupName,
      this.subscriptionOptions() as SubscriptionOptions
    );

    subscription.on("message", (msg: Message) => {
      console.log(`Message received: ${this.subject} / ${this.queueGroupName}`);
      const parsedData = this.parseMessage(msg);
      this.onMessage(parsedData, msg);
    });
  }
 
  parseMessage(msg: Message) {
    const data = msg.getData();
    return typeof data === "string" ? JSON.parse(data) : JSON.parse(data.toString("utf-8"));
  }
}

class TicketCreatedListener extends Listener {
  subject = "ticket:created";
  queueGroupName = "payments-service";
  onMessage(data: any, msg: Message): void {
    console.log("Ticket created:", data);
    msg.ack();
  }
}
