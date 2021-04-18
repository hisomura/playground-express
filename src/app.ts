import express from "express";
import { FindOptions } from "sequelize";
import { Post } from "./models/Post";
import { User } from "./models/User";
import bodyParser from "body-parser";

export const app = express();
const port = 3000;
app.use(bodyParser.json());

app.get("/", (req, res) => {
  res.send("Hello, World!");
});

app.get("/users", async (req, res) => {
  const options: FindOptions = {};
  if (
    ["id", "firstName", "lastName", "email", "createdAt", "updatedAt"].some(
      (c) => c === req.query.sort
    ) &&
    ["asc", "desc"].some((d) => d === req.query.direction)
  ) {
    // @ts-ignore
    options.order = [[req.query.sort, req.query.direction]];
  }
  const users = await User.findAll(options);
  res.send(users);
});

app.get("/users/:userId/posts", async (req, res) => {
  if (!req.params.userId) throw new Error("No userId");

  const userId = parseInt(req.params.userId);
  if (!userId) throw new Error(`Wrong userId: ${req.params.userId}`); // ユーザーIDは0以上なのでこれで良い

  const posts = await Post.findAll({
    where: { userId },
  });
  res.send(posts ?? {});
});

app.get("/users/:userId", async (req, res) => {
  if (!req.params.userId) throw new Error("No userId");

  const userId = parseInt(req.params.userId);
  if (!userId) throw new Error();  // ユーザーIDは0以上なのでこれで良い

  const users = await User.findByPk(userId);
  res.send(users ?? {});
});

type UserPut = {
  firstName: string;
  lastName: string;
};
app.put<UserPut>("/users", async (req, res) => {
  const { firstName, lastName } = req.body;

  if (firstName == null || typeof firstName !== "string") {
    throw new Error();
  }

  if (lastName == null || typeof lastName !== "string") {
    throw new Error();
  }

  const values = { firstName, lastName };
  const result = await User.create(values);

  res.send(result);
});

export const server = app.listen(port, () => {
  console.log(`Example app listening at http://localhost:${port}`);
});
