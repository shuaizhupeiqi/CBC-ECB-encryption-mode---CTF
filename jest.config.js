const path = require("path");

module.exports = {
  testEnvironment: "jest-environment-jsdom",
  moduleNameMapper: {
    "\\.(css|less|sass|scss)$": "identity-obj-proxy",
  },
  setupFilesAfterEnv: [path.resolve(__dirname, "./setupTests.js")],
  testMatch: ["**/tests/**/*.test.js"],
  roots: [path.resolve(__dirname, "..")],
  transform: {
    "^.+\\.(t|j)sx?$": ["@swc/jest"],
  },
  extensionsToTreatAsEsm: [".jsx"],
};
