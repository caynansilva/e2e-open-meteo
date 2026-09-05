const { readdirSync } = require("node:fs");
const path = require("node:path");
const { spawnSync } = require("node:child_process");

const projectRoot = path.resolve(__dirname, "..");
const featuresDirectory = path.join(projectRoot, "e2e-tests");
const cucumberBinary = path.join(
  projectRoot,
  "node_modules",
  "@cucumber",
  "cucumber",
  "bin",
  "cucumber.js"
);

function findFeatureFiles(directoryPath) {
  return readdirSync(directoryPath, { withFileTypes: true })
    .flatMap((entry) => {
      const entryPath = path.join(directoryPath, entry.name);

      if (entry.isDirectory()) {
        return findFeatureFiles(entryPath);
      }

      return entry.isFile() && entry.name.endsWith(".feature")
        ? [entryPath]
        : [];
    })
    .sort();
}

function runFeature(featurePath) {
  const relativeFeaturePath = path.relative(projectRoot, featurePath);

  console.log(`\n=== ${relativeFeaturePath} ===`);

  const result = spawnSync(
    process.execPath,
    [cucumberBinary, relativeFeaturePath],
    { cwd: projectRoot, stdio: "inherit" }
  );

  return result.status === 0;
}

function reportFailedFeatures(failedFeatures) {
  if (failedFeatures.length === 0) {
    console.log("\nAll Cucumber features passed.");
    return;
  }

  console.error("\nFailed Cucumber features:");
  failedFeatures.forEach((featurePath) =>
    console.error(`- ${path.relative(projectRoot, featurePath)}`)
  );
}

function runAllFeatures() {
  const featureFiles = findFeatureFiles(featuresDirectory);
  const failedFeatures = featureFiles.filter((featurePath) =>
    !runFeature(featurePath)
  );

  reportFailedFeatures(failedFeatures);
  process.exitCode = failedFeatures.length === 0 ? 0 : 1;
}

runAllFeatures();
