import request from "supertest";
import { app, server } from "./app";
// @ts-ignore
import { sequelize, User } from "./models";
// @ts-ignore
import { userFactory } from "../db/factories/user";

describe("first express test", () => {
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
      User.create(userFactory.build()),
      User.create(userFactory.build()),
    ]);
    // createdAt と updatedAt を丸めるために必要
    users.forEach((user) => user.reload());

    const response = await request(app).get("/users");
    expect(response.body.length).toBe(2);
    expect(response.body).toEqual(JSON.parse(JSON.stringify(users)));
  });
});
