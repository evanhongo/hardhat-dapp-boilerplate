module.exports = {
  preset: "ts-jest",
  verbose: true,
  testRegex: "(/unit-test/.*|\\.(test|spec))\\.tsx?$",
  moduleFileExtensions: ["js", "json", "jsx", "node", "ts", "tsx"],
  coverageThreshold: {
    global: {
      branches: 30,
      functions: 90,
      lines: 90,
      statements: 90,
    },
  },
  testEnvironment: "node",
};
