import { afterAll, beforeAll, beforeEach } from "@jest/globals";
import { MongoMemoryServer } from "mongodb-memory-server";
import mongoose from "mongoose";

let mongo: MongoMemoryServer | undefined;

beforeAll(async () => {
  process.env.JWT_KEY ??= "asdf";

  mongo = await MongoMemoryServer.create();
  await mongoose.connect(mongo.getUri());
});

beforeEach(async () => {
  const collections = await mongoose.connection.db?.collections();
  if (!collections?.length) return;

  await Promise.all(collections.map((collection) => collection.deleteMany({})));
});

afterAll(async () => {
  await mongoose.disconnect();
  await mongo?.stop();
});

declare global {
  var signin: () => Promise<string[]>;
}

(global.signin as any) = async () => {
  const email = "test@test.com";
  const password = "password";

  const response = await request(app)
    .post("/api/users/signup")
    .send({ email, password })
    .expect(201);

    const cookie = response.get("Set-Cookie");
};