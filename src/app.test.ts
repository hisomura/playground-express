import { Transaction } from "sequelize";
import request from "supertest";
import { app, server } from "./app";
// @ts-ignore
import { sequelize, User } from "./models";

describe("first express test", () => {
  test("/ return 'Hello, World!'", async () => {
    const response = await request(app).get("/");
    expect(response.status).toBe(200);
    expect(response.text).toBe("Hello, World!");
  });

  test("/users return users data", async () => {
    sequelize.transaction(async (t: Transaction) => {
      const response = await request(app).get("/users");
      expect(response.status).toBe(200);
      expect(response.body.length).toBe(1);
      t.rollback();
    });
  });

  afterAll(async () => {
    server.close();
  });
});
