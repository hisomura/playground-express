const FactoryGirl = require("factory-girl");
const factory = FactoryGirl.factory;
const adapter = new FactoryGirl.SequelizeAdapter();
const models = require("./models");
const User = models.User;
const Post = models.Post;
const faker = require("faker");

const Sequelize = require("sequelize");
const path = require("path");
const Umzug = require("umzug");

// creates a basic sqlite database
// const sequelize = new Sequelize({ dialect: "sqlite", storage: ":memory:" });
const sequelize = User.sequelize;

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
  logging: console.log,
});

function factoryName(model, name = undefined) {
  if (!name) return model.name;

  return `${model.name}:${name}`;
}

(async () => {
  // checks migrations and run them if they are not already applied
  await umzug.up();
  console.log("All migrations performed successfully");
})().then(async () => {
  factory.setAdapter(adapter);
  factory.define(factoryName(User, "base"), User, {
    firstName: faker.name.firstName,
    lastName: faker.name.lastName,
    email: faker.internet.email,
  });
  factory.extend(
    factoryName(User, "base"),
    factoryName(User, "default"),
    {},
    {
      afterCreate: (model, attr, buildOptions) => {
        if (attr.posts) {
          posts(model, attr, buildOptions);
        } else {
          factory.createMany(factoryName(Post, "base"), 3, {
            userId: model.id,
          });
        }
        return model;
      },
    }
  );

  factory.define(factoryName(Post, "base"), Post, {
    userId: 0,
    title: faker.name.title,
    body: faker.lorem.paragraph,
  });

  const user = await factory.create(factoryName(User, "default"));
  console.log(await user.getPosts());

  const user2 = await factory.create(
    factoryName(User, "default"),
    {},
    {
      afterCreate: (model, attr, buildOptions) => {
        factory.create(factoryName(Post, "base"), { userId: model.id });
        return model;
      },
    }
  );
  console.log(user2);

  // const post = await factory.create("post", { userId: user.id });
});
