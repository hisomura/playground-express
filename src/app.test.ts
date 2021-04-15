import axios from "axios";
import factory from "factory-girl";
import request from "supertest";
import { app, server } from "./app";

import { User } from "./models/User";
// @ts-ignore
import { userFactory } from "../db/factories/user";
import { migrate, setupFactories } from "./test-utils";

const client = axios.create({
  baseURL: `http://localhost:3000`,
  timeout: 1000,
  headers: { "X-Custom-Header": "foobar" },
});

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

  it("/ returns 'Hello, World!'", async () => {
    const response = await client.get("/");
    expect(response.status).toBe(200);
    expect(response.data).toBe("Hello, World!");
  });

  describe("/users", () => {
    it("GETリクエストで全てのユーザーを返す", async () => {
      const users = await factory.createMany(User.name, 2);
      const response = await client.get("/users");
      expect(response.data.length).toBe(2);
      expect(response.data).toEqual(JSON.parse(JSON.stringify(users)));
    });
  });
});
