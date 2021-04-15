import factory from "factory-girl";
import request from "supertest";
import { app, server } from "./app";

import { User } from "./models/User";
// @ts-ignore
import { userFactory } from "../db/factories/user";
import { migrate, setupFactories } from "./test-utils";

describe("first express test", () => {
  beforeAll(async () => {
    await migrate();
    await setupFactories();
  });
  afterEach(async () => {
    // 全テーブル削除
    await User.destroy({ where: {} });
  });
  afterAll(async () => {
    server.close();
  });

  test("/ returns 'Hello, World!'", async () => {
    const response = await request(app).get("/");
    expect(response.status).toBe(200);
    expect(response.text).toBe("Hello, World!");
  });

  test("/users returns users data", async () => {
    const users = await Promise.all([
      factory.create(User.name),
      factory.create(User.name),
    ]);

    const response = await request(app).get("/users");
    expect(response.body.length).toBe(2);
    expect(response.body).toEqual(JSON.parse(JSON.stringify(users)));
  });
});
