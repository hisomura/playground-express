const FactoryGirl = require("factory-girl");
const factory = FactoryGirl.factory;
const adapter = new FactoryGirl.SequelizeAdapter();
const User = require("./models").User;

factory.setAdapter(adapter)
factory.define("user", User, {
  firstName: "Bob",
  lastName: "Tanaka",
});

factory.build("user").then((user) => {
  console.log(user.firstName, user.lastName); // => User {username: 'Bob', score: 50}
});
