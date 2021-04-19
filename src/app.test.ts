import axios from "axios";
import factory from "factory-girl";
// @ts-ignore
import { userFactory } from "../db/factories/user";
import { server } from "./app";
import { Post } from "./models/Post";
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
    if ("mysql" === sequelize.getDialect()) {
      await sequelize.query('SET GLOBAL FOREIGN_KEY_CHECKS = 0')
    }
    await sequelize.sync({ force: true });
    await setupFactories();
  });
  afterEach(async () => {
    // 全テーブル削除
    await sequelize.truncate();
  });
  afterAll(async () => {
    await sequelize.drop();
    server.close();
  });

  it("/ returns 'Hello, World!'", async () => {
    const response = await client.get("/");
    expect(response.status).toBe(200);
    expect(response.data).toBe("Hello, World!");
  });

  describe("/users", () => {
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

    describe("/users/:userId", () => {
      it("GETリクエストで指定したユーザーの情報を返す", async () => {
        const users = await factory.createMany<User>(User.name, 3);
        const userId = users[1].id;
        const response = await client.get(`/users/${userId}`);
        expect(response.data.id).toBe(userId);
      });
      it("GETリクエストで存在しないユーザーを指定した場合空のオブジェクトを返す", async () => {
        await factory.createMany<User>(User.name, 3);
        const userId = 4294967295; // 32bit intの最大値
        const response = await client.get(`/users/${userId}`);
        expect(response.data).toEqual({});
      });
    });

    describe("/users/:userId/posts", () => {
      it("GETリクエストで指定したユーザーの投稿を全て返す", async () => {
        await factory.createMany(Post.name, 2);
        const user = await factory.create<User>(User.name);
        await factory.createMany<Post>(Post.name, 3, {
          userId: user.id,
        });
        const response = await client.get(`/users/${user.id}/posts`);
        expect(response.data.length).toBe(3);
        expect(response.data[0].userId).toEqual(user.id);
        expect(response.data[1].userId).toEqual(user.id);
        expect(response.data[2].userId).toEqual(user.id);
      });
    });
  });
});
