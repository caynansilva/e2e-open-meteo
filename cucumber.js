const hasExplicitFeaturePath = process.argv
  .slice(2)
  .some((argument) => argument.includes(".feature"));

module.exports = {
  default: {
    paths: hasExplicitFeaturePath ? [] : ["e2e-tests/**/*.feature"],
    requireModule: ["ts-node/register", "tsconfig-paths/register"],
    require: [
      "src/Support/CucumberWorld.ts",
      "src/Support/hooks.ts",
      "src/Tests/specs/**/*.spec.ts"
    ],
    format: ["progress"],
    publish: false
  }
};
