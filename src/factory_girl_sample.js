const FactoryGirl = require("factory-girl");
const factory = FactoryGirl.factory;
const adapter = new FactoryGirl.SequelizeAdapter();
const models = require("./models");
const User = models.User;

const Sequelize = require("sequelize");
const path = require("path");
const Umzug = require("umzug");

// creates a basic sqlite database
// const sequelize = new Sequelize({ dialect: "sqlite", storage: ":memory:" });
const sequelize = User.sequelize

const umzug = new Umzug({
  migrations: {
    // indicates the folder containing the migration .js files
    path: path.join(__dirname, "/../db/migrations"),
    // inject sequelize's QueryInterface in the migrations
    params: [
      sequelize.getQueryInterface(),
      Sequelize
    ],
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

(async () => {
  // checks migrations and run them if they are not already applied
  await umzug.up();
  console.log("All migrations performed successfully");
})().then(async () => {
  factory.setAdapter(adapter);
  factory.define("user", User, {
    firstName: "Bob",
    lastName: "Tanaka",
  });

  await factory.create("user");
  console.log(await User.findAll());
});
