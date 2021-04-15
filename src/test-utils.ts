import { factory } from "factory-girl";
import faker from "faker";
import path from "path";
import Sequelize from "sequelize";
import Umzug from "umzug";
import { Post } from "./models/Post";
import { User } from "./models/User";
import { sequelize } from "./sequelize";

const adapter = new (require("factory-girl").SequelizeAdapter)();

export const migrate = async () => {
  const umzug = new Umzug({
    migrations: {
      // indicates the folder containing the migration .js files
      path: path.join(__dirname, "/../db/migrations"),
      // inject sequelize's QueryInterface in the migrations
      params: [sequelize.getQueryInterface(), Sequelize],
    },

    // indicates that the migration data should be store in the database
    // itself through sequelize. The default configuration creates a table
    // named `SequelizeMeta`.
    storage: "sequelize",
    storageOptions: {
      sequelize: sequelize,
    },
  });

  await umzug.up();
};

export const setupFactories = async () => {
  factory.setAdapter(adapter);
  factory.define(User.name, User, {
    firstName: faker.name.firstName,
    lastName: faker.name.lastName,
    email: faker.internet.email,
  });
  factory.define(Post.name, Post, {
    userId: factory.assoc(User.name, "id"),
    title: faker.name.title,
    body: faker.lorem.paragraph,
  });
};
