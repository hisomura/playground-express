import { factory } from "factory-girl";
import faker from "faker";
import path from "path";

import Sequelize from "sequelize";
import Umzug from "umzug";
import { Post } from "./models/Post";
import { User } from "./models/User";
import { sequelize } from "./sequelize";

const adapter = new (require("factory-girl").SequelizeAdapter)();

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

(async () => {
  // checks migrations and run them if they are not already applied
  await umzug.up();
  console.log("All migrations performed successfully");
})().then(async () => {
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

  const post = await factory.create<Post>(Post.name);
  const post2 = await factory.create<Post>(Post.name, {
    userId: (
      await factory.create<User>(User.name, {
        firstName: "Taro",
        lastName: "Yamada",
      })
    ).id,
  });

  const post3 = await factory.create<Post>(Post.name, {
    userId: (await post2.$get("user"))?.id,
  });

  console.log(post);
  console.log(post2);
  console.log(post3);

  console.log(await User.findAll());
});
