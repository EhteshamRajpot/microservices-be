import nats from "node-nats-streaming";
import { TicketCreatedPublisher } from "./events/ticket-created-publisher.js";

const natsUrl = process.env.NATS_URL || "nats://localhost:4222";
const clientId = `publisher-${Math.random().toString(16).slice(2, 10)}`;

const stan = nats.connect("ticketing", clientId, {
  url: natsUrl,
});

stan.on("connect", async () => {
  console.log("Publisher connected to NATS");

  const publisher = new TicketCreatedPublisher(stan);
  try {
    await publisher.publish({
      id: "123",
      title: "concert",
      price: 10
    });
  } catch (err) {
    console.error("Error publishing event:", err);
  }

  // const data = JSON.stringify({
  //   id: "123",
  //   title: "concert",
  //   price: 10,
  // });

  // stan.publish("TicketCreated", data, () => {
  //   console.log("Event published");
  // });
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
        "Or set NATS_URL (e.g. nats://localhost:4222 after port-forward, or nats://nats-srv:4222 inside Kubernetes).\n"
    );
  }
});
