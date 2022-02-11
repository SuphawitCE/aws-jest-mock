const dayjs = require("dayjs");

console.log("------------ person -------------");
const person = (firstName, lastName, age) => {
  console.log("person: ", firstName, lastName, age);
  return `He is ${firstName} ${lastName} age ${age}`;
};

module.exports = {
  person,
};
