const Factory = require("rosie").Factory;
const faker = require("faker");

const userFactory = new Factory();
userFactory
  .attr("firstName", faker.name.firstName)
  .attr("lastName", faker.name.lastName)
  .attr("email", faker.internet.email)
  .attr("createdAt", faker.date.past)
  .attr("updatedAt", faker.date.past);

module.exports = { userFactory };
