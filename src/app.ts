import express from "express";
import { User } from "./models/User";

export const app = express();
const port = 3000;

app.get("/", (req, res) => {
  res.send("Hello, World!");
});

app.get("/users", async (req, res) => {
  const users = await User.findAll({ order: [["id", "asc"]] });
  res.send(users);
});

export const server = app.listen(port, () => {
  console.log(`Example app listening at http://localhost:${port}`);
});
