import express from "express";
import { User } from "./models/User";
import bodyParser from 'body-parser'

export const app = express();
const port = 3000;
app.use(bodyParser.json())

app.get("/", (req, res) => {
  res.send("Hello, World!");
});

app.get("/users", async (req, res) => {
  const users = await User.findAll({ order: [["id", "asc"]] });
  res.send(users);
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

  const values = { firstName, lastName }
  const result = await User.create(values);

  res.send(result);
});

export const server = app.listen(port, () => {
  console.log(`Example app listening at http://localhost:${port}`);
});
