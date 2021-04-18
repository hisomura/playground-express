import axios from "axios";
import factory from "factory-girl";
// @ts-ignore
import { userFactory } from "../db/factories/user";
import { server } from "./app";
import { User } from "./models/User";

import { sequelize } from "./sequelize";
import { setupFactories } from "./test-utils";

const client = axios.create({
  baseURL: `http://localhost:3000`,
  timeout: 1000,
  headers: { "X-Custom-Header": "foobar" },
});

describe("first express test", () => {
  beforeAll(async () => {
    // await migrate();
    // マイグレーション直接実行するより速い
    await sequelize.sync()
    await setupFactories();
  });
  afterEach(async () => {
    // 全テーブル削除
    await sequelize.truncate();
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

    it("GETリクエストで指定したソート順でユーザーを返す", async () => {
      await factory.create<User>(User.name, { firstName: "Taro" });
      await factory.create<User>(User.name, { firstName: "Ichiro" });
      await factory.create<User>(User.name, { firstName: "Jiro" });
      const response = await client.get("/users?sort=firstName&direction=asc");
      expect(response.data.length).toBe(3);
      expect(response.data[0].firstName).toEqual("Ichiro");
      expect(response.data[1].firstName).toEqual("Jiro");
      expect(response.data[2].firstName).toEqual("Taro");
    });

    it("PUTリクエストでユーザーを作成する", async () => {
      const response = await client.put("/users", {
        firstName: "Taro",
        lastName: "Yamada",
      });
      expect(response.status).toBe(200);
      expect(response.data.firstName).toBe("Taro");

      // 振る舞いのテストになってない気もする
      const user = await User.findOne({ where: { firstName: "Taro" } });
      expect(user?.lastName).toBe("Yamada");
    });
  });
});
