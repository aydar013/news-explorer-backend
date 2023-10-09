// const { NODE_ENV, JWT_SECRET } = process.env;

// const constants = {
//   JWT_SECRET: NODE_ENV === "production" ? JWT_SECRET : "supersecrettoken",
// };

// module.exports = constants;

const { JWT_SECRET = "supersecrettoken" } = process.env;

module.exports = {
  JWT_SECRET,
};
