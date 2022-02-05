/** @type {import('ts-jest/dist/types').InitialOptionsTsJest} */
module.exports = {
  preset: "ts-jest",
  testEnvironment: "jsdom",
  transform: {
    "^.+\\.vue$": "vue3-jest",
  },
  moduleFileExtensions: ["json", "js", "jsx", "ts", "tsx", "vue"],
  moduleNameMapper: {
    "^@/(.*)$": "<rootDir>/src/$1",
    "^@unit/(.*)$": "<rootDir>/tests/unit/$1",
    "\\.(css|scss|less)$": "identity-obj-proxy",
    "^lodash-es$": "lodash",
  },
};
