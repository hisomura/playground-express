import { Sequelize } from "sequelize-typescript";

const env = process.env.NODE_ENV || "development";
const config = require(__dirname + "/../database.json")[env];

export const sequelize = new Sequelize({
  ...config,
  models: [__dirname + "/models_ts"],
});
