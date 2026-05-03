
import { natsWrapper } from "./nats-wrapper.js";
import { OrderCreatedListener } from "./events/listeners/order-created-listener.js";

const start = async () => {

  const natsClusterId = process.env.NATS_CLUSTER_ID || "ticketing";
  const natsClientId = process.env.NATS_CLIENT_ID || `tickets-${Math.random().toString(16).slice(2, 8)}`;
  const natsUrl = process.env.NATS_URL || "nats://nats-srv:4222";
  try {
    await natsWrapper.connect(natsClusterId, natsClientId, natsUrl);

    new OrderCreatedListener(natsWrapper.client).listen();
  } catch (err) {
    console.error(err);
    process.exit(1);
  }
};

start();
