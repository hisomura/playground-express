import express from "express";
// @ts-ignore
// import User from "./models/user.js";
import { User } from "./models";

export const app = express();
const port = 3000;

app.get("/", (req, res) => {
  res.send("Hello, World!");
});

app.get("/users", async (req, res) => {
  await User.create();
  const users = await User.findAll();
  res.send(users);
});

export const server = app.listen(port, () => {
  console.log(`Example app listening at http://localhost:${port}`);
});
