import nats from "node-nats-streaming";
import type { Message } from "node-nats-streaming";
import { randomBytes } from "crypto";
import { TicketCreatedListener } from "./events/ticket-created-listener.js";

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

