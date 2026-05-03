import mongoose from "mongoose";
import { app } from "./app.js";
import { natsWrapper } from "./nats-wrapper.js";
import dotenv from "dotenv";
import { TicketCreatedListener } from "./events/listeners/ticket-created-listener.js";
import { TicketUpdatedListener } from "./events/listeners/ticket-updated-listener.js";
import { ExpirationCompleteListener } from "./events/listeners/expiration-complete-listener.js";

dotenv.config();

const start = async () => {
  if (!process.env.JWT_KEY) {
    throw new Error("JWT_KEY must be defined");
  }
  if (!process.env.MONGO_URI) {
    throw new Error("MONGO_URI must be defined");
  }
  const natsClusterId = process.env.NATS_CLUSTER_ID || "ticketing";
  const natsClientId = process.env.NATS_CLIENT_ID || `tickets-${Math.random().toString(16).slice(2, 8)}`;
  const natsUrl = process.env.NATS_URL || "http://nats-srv:4222";
  try {
    new TicketCreatedListener(natsWrapper.client).listen();
    new TicketUpdatedListener(natsWrapper.client).listen();
    new ExpirationCompleteListener(natsWrapper.client).listen();
    
    await natsWrapper.connect(natsClusterId, natsClientId, natsUrl);

    const conn = await mongoose.connect(process.env.MONGO_URI);
    console.log("Connected to MongoDB at port", conn.connection.port);
  } catch (err) {
    console.error(err);
  }
  app.listen(3000, () => {
    console.log("Listening on port 3000!");
  });
};

start();
