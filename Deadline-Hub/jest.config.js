const nextJest = require("next/jest");

const createJestConfig = nextJest({ dir: "./" });

module.exports = createJestConfig({
  testEnvironment: "node",
  verbose: true,
  reporters: ["default"],
  moduleNameMapper: { "^@/(.*)$": "<rootDir>/$1" },
});
