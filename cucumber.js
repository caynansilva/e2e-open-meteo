const path = require("node:path");

const explicitFeaturePath = process.argv
  .slice(2)
  .find((argument) => argument.endsWith(".feature"));

const requireSpecs = explicitFeaturePath
  ? [`src/Tests/specs/${path.basename(explicitFeaturePath, ".feature")}.spec.ts`]
  : ["src/Tests/specs/**/*.spec.ts"];

module.exports = {
  default: {
    paths: explicitFeaturePath ? [] : ["e2e-tests/**/*.feature"],
    requireModule: ["ts-node/register", "tsconfig-paths/register"],
    require: [
      "src/Support/CucumberWorld.ts",
      "src/Support/hooks.ts",
      ...requireSpecs
    ],
    format: ["progress"],
    parallel: 0,
    publish: false
  }
};
