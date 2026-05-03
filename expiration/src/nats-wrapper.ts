import nats from "node-nats-streaming";
import type { Stan } from "node-nats-streaming";

class NatsWrapper {
  private _client?: Stan;

  get client(): Stan {
    if (!this._client) {
      throw new Error("Cannot access NATS client before connecting");
    }
    return this._client;
  }

  connect(clusterId: string, clientId: string, url: string): Promise<void> {
    this._client = nats.connect(clusterId, clientId, { url });

    this._client.on('close', () => {
      console.log("NATS connection closed!");
      process.exit();
    });

    process.on('SIGINT', () => this._client?.close());
    process.on('SIGTERM', () => this._client?.close());

    return new Promise((resolve, reject) => {
      this._client?.on("connect", () => {
        console.log("Connected to NATS!");
        resolve();
      });
      this._client?.on("error", (err: ErrorEvent) => {
        reject(new Error(`Error connecting to NATS: ${err.message}` as string));
      });
    });
  }
}

export const natsWrapper = new NatsWrapper();