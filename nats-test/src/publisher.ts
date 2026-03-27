import nats from "node-nats-streaming";

const natsUrl = process.env.NATS_URL || "nats://localhost:4222";
const clientId = `publisher-${Math.random().toString(16).slice(2, 10)}`;

const stan = nats.connect("ticketing", clientId, {
  url: natsUrl,
});

stan.on("connect", () => {
  console.log("Publisher connected to NATS");

  const data = JSON.stringify({
    id: "123",
    title: "concert",
    price: 10,
  });

  stan.publish("ticket:created", data, () => {
    console.log("Event published");
  });
});

stan.on("error", (err) => {
  console.error("NATS connection error:", err.message);
});
