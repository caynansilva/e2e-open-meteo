import * as fs from "fs";
import * as path from "path";

const DEFAULT_SPECS_DIR = "src/Tests/specs";
const DEFAULT_STEPS_DIR = "src/Tests/Steps";
type BindingKeyword = "Given" | "When" | "Then";

interface StepBinding {
  keyword: BindingKeyword;
  expression: string;
  parameterNames: string[];
  hasDataTable: boolean;
  sourceText: string;
  commandName: string;
}

interface ParsedStep {
  keyword: BindingKeyword;
  description: string;
  hasDataTable: boolean;
}

function parseFeatureSteps(gherkinText: string): ParsedStep[] {
  const lines = gherkinText.split(/\r?\n/);
  const steps: ParsedStep[] = [];
  let previousKeyword: BindingKeyword | undefined;

  for (let index = 0; index < lines.length; index += 1) {
    const match = lines[index]?.trim().match(/^(Given|When|Then|And|But)\s+(.+)$/i);
    if (!match?.[1] || !match[2]) {
      continue;
    }

    const keyword = resolveBindingKeyword(match[1], previousKeyword);
    if (!keyword) {
      continue;
    }

    steps.push({
      keyword,
      description: normalizeStepText(match[2]),
      hasDataTable: lines[index + 1]?.trim().startsWith("|") ?? false,
    });
    previousKeyword = keyword;
  }

  return steps;
}

function resolveBindingKeyword(keyword: string, previousKeyword?: BindingKeyword): BindingKeyword | undefined {
  const normalizedKeyword = keyword.toLowerCase();
  if (normalizedKeyword === "given") {
    return "Given";
  }
  if (normalizedKeyword === "when") {
    return "When";
  }
  if (normalizedKeyword === "then") {
    return "Then";
  }
  return previousKeyword;
}

function normalizeStepText(description: string): string {
  const trimmedDescription = description.trim();
  return trimmedDescription.endsWith(".") ? trimmedDescription.slice(0, -1) : trimmedDescription;
}

function createBinding(step: ParsedStep): StepBinding {
  const parameterNames: string[] = [];
  const expression = step.description.replace(
    /"[^"]*"|'[^']*'|<[^>]+>|\b\d+\b/g,
    (token, offset: number, fullText: string) => {
      const isInteger = /^\d+$/.test(token);
      parameterNames.push(inferParameterName(token, fullText, offset, isInteger));
      return isInteger ? "{int}" : "{string}";
    }
  );

  return {
    keyword: step.keyword,
    expression,
    parameterNames: makeNamesUnique(parameterNames),
    hasDataTable: step.hasDataTable,
    sourceText: step.description,
    commandName: toStepCommandName(expression),
  };
}

function inferParameterName(token: string, fullText: string, offset: number, isInteger: boolean): string {
  if (isInteger) {
    const suffix = fullText.slice(offset + token.length);
    return /\bdays?\b/i.test(suffix) ? "expectedDays" : "expectedValue";
  }

  const outlineMatch = token.match(/^<([A-Za-z][A-Za-z0-9_]*)>$/);
  if (outlineMatch?.[1]) {
    return outlineMatch[1];
  }

  const prefix = fullText.slice(0, offset);
  return /\b(city|town|location)\b/i.test(fullText) || /\bfor\s*$/i.test(prefix) ? "city" : "value";
}

function makeNamesUnique(names: string[]): string[] {
  const counts = new Map<string, number>();
  return names.map((name) => {
    const count = counts.get(name) ?? 0;
    counts.set(name, count + 1);
    return count === 0 ? name : `${name}${count + 1}`;
  });
}

function toStepCommandName(expression: string): string {
  const words = expression
    .replace(/\{string\}/g, " string ")
    .replace(/\{int\}/g, " int ")
    .replace(/[^A-Za-z0-9]+/g, " ")
    .trim()
    .split(/\s+/)
    .filter(Boolean);

  return words.length > 0 ? words.join("_").toUpperCase() : "UNNAMED_STEP";
}

function toStepsClassName(featureName: string): string {
  const words = featureName.replace(/[^A-Za-z0-9]+/g, " ").trim().split(/\s+/).filter(Boolean);
  const className = words
    .map((word) => {
      const normalizedWord = word.toLowerCase();
      return `${normalizedWord[0]?.toUpperCase() ?? ""}${normalizedWord.slice(1)}`;
    })
    .join("");

  return `${className || "GeneratedFeature"}Steps`;
}

function createBindings(gherkinText: string): StepBinding[] {
  const bindings = new Map<string, StepBinding>();

  for (const step of parseFeatureSteps(gherkinText)) {
    const binding = createBinding(step);
    const existingBinding = bindings.get(binding.expression);
    if (existingBinding) {
      existingBinding.hasDataTable ||= binding.hasDataTable;
      continue;
    }
    bindings.set(binding.expression, binding);
  }

  return [...bindings.values()];
}

function createParameterSignature(binding: StepBinding): string {
  const parameterTypes = binding.expression.match(/\{(string|int)\}/g) ?? [];
  const parameters = binding.parameterNames.map((name, index) => {
    const type = parameterTypes[index] === "{int}" ? "number" : "string";
    return `${name}: ${type}`;
  });

  if (binding.hasDataTable) {
    parameters.push("table: DataTable");
  }

  return parameters.join(", ");
}

function renderBinding(binding: StepBinding): string {
  const expression = JSON.stringify(binding.expression);
  const parameters = createParameterSignature(binding);
  const argumentsList = [...binding.parameterNames, ...(binding.hasDataTable ? ["table"] : [])].join(", ");

  return `${binding.keyword}(${expression}, (${parameters}) => steps.${binding.commandName}(${argumentsList}));`;
}

function renderStepCommand(binding: StepBinding): string {
  const parameters = createParameterSignature(binding);
  const signature = parameters ? `(${parameters})` : "()";

  return `  public ${binding.commandName}${signature}: void {
    throw new Error(${JSON.stringify(`TODO: Implement ${binding.sourceText}`)});
  }`;
}

function transformGherkinToFunctions(gherkinText: string, featureName: string, stepsImportPath: string): string {
  const bindings = createBindings(gherkinText);
  const requiresDataTable = bindings.some((binding) => binding.hasDataTable);
  const cucumberImports = requiresDataTable
    ? "import { DataTable, Given, Then, When } from \"@cucumber/cucumber\";"
    : "import { Given, Then, When } from \"@cucumber/cucumber\";";
  const className = toStepsClassName(featureName);
  const renderedBindings = bindings.map(renderBinding).join("\n\n");

  return `// Native Cucumber bindings generated from: ${featureName}
${cucumberImports}
import { ${className} } from "${stepsImportPath}";

const steps = new ${className}();

${renderedBindings}
`;
}

function transformGherkinToSteps(
  gherkinText: string,
  featureName: string,
  cucumberWorldImportPath: string = "../../Support/CucumberWorld"
): string {
  const bindings = createBindings(gherkinText);
  const requiresDataTable = bindings.some((binding) => binding.hasDataTable);
  const cucumberImports = requiresDataTable
    ? "import { DataTable, world as cucumberWorld } from \"@cucumber/cucumber\";"
    : "import { world as cucumberWorld } from \"@cucumber/cucumber\";";
  const className = toStepsClassName(featureName);
  const commands = bindings.map(renderStepCommand).join("\n\n");

  return `// Steps generated from: ${featureName}
${cucumberImports}
import { CucumberWorld } from "${cucumberWorldImportPath}";

export class ${className} {
  private get world(): CucumberWorld {
    return cucumberWorld as CucumberWorld;
  }

${commands}
}
`;
}

function writeGeneratedPair(specPath: string, stepsPath: string, specContent: string, stepsContent: string, force: boolean): boolean {
  if (!force && (fs.existsSync(specPath) || fs.existsSync(stepsPath))) {
    console.log(`⏭️ Preserved generated pair because an output already exists: ${specPath}, ${stepsPath}`);
    return false;
  }

  fs.mkdirSync(path.dirname(specPath), { recursive: true });
  fs.mkdirSync(path.dirname(stepsPath), { recursive: true });
  fs.writeFileSync(specPath, specContent, "utf8");
  fs.writeFileSync(stepsPath, stepsContent, "utf8");
  return true;
}

function processFeatureFile(
  featureFilePath: string,
  specsDir: string = DEFAULT_SPECS_DIR,
  stepsDirOrForce: string | boolean = DEFAULT_STEPS_DIR,
  force = false
): void {
  const stat = fs.statSync(featureFilePath);
  if (stat.isDirectory()) {
    throw new Error(`\"${featureFilePath}\" is a directory. Use --dir flag.`);
  }

  const gherkinContent = fs.readFileSync(featureFilePath, "utf8");
  const stepsDir = typeof stepsDirOrForce === "string" ? stepsDirOrForce : DEFAULT_STEPS_DIR;
  const shouldForce = typeof stepsDirOrForce === "boolean" ? stepsDirOrForce : force;
  const featureName = gherkinContent.match(/^Feature:\s*(.+)$/m)?.[1]?.trim() ?? "Unknown Feature";
  const baseName = path.basename(featureFilePath, ".feature");
  const specPath = path.join(specsDir, `${baseName}.spec.ts`);
  const stepsPath = path.join(stepsDir, `${baseName}.steps.ts`);
  const relativeStepsImport = path.relative(path.dirname(specPath), stepsPath).replace(/\\/g, "/").replace(/\.ts$/, "");
  const stepsImportPath = relativeStepsImport.startsWith(".") ? relativeStepsImport : `./${relativeStepsImport}`;
  const relativeWorldImport = path.relative(path.dirname(stepsPath), path.join("src", "Support", "CucumberWorld.ts"))
    .replace(/\\/g, "/")
    .replace(/\.ts$/, "");
  const cucumberWorldImportPath = relativeWorldImport.startsWith(".") ? relativeWorldImport : `./${relativeWorldImport}`;
  const specContent = transformGherkinToFunctions(gherkinContent, featureName, stepsImportPath);
  const stepsContent = transformGherkinToSteps(gherkinContent, featureName, cucumberWorldImportPath);
  const wasWritten = writeGeneratedPair(specPath, stepsPath, specContent, stepsContent, shouldForce);

  if (wasWritten) {
    console.log(`✅ Generated Cucumber spec: ${specPath}`);
    console.log(`✅ Generated Cucumber Steps: ${stepsPath}`);
  }
  console.log(`🔢 Bindings found: ${createBindings(gherkinContent).length}`);
}

function processAllFeatureFiles(
  inputDir: string,
  specsDir: string = DEFAULT_SPECS_DIR,
  stepsDirOrForce: string | boolean = DEFAULT_STEPS_DIR,
  force = false
): void {
  const featureFiles = findFeatureFiles(inputDir);
  if (featureFiles.length === 0) {
    console.log("No .feature files found in the input directory.");
    return;
  }

  const stepsDir = typeof stepsDirOrForce === "string" ? stepsDirOrForce : DEFAULT_STEPS_DIR;
  const shouldForce = typeof stepsDirOrForce === "boolean" ? stepsDirOrForce : force;

  for (const featureFile of featureFiles) {
    const relativeDirectory = path.dirname(path.relative(inputDir, featureFile));
    processFeatureFile(
      featureFile,
      path.join(specsDir, relativeDirectory),
      path.join(stepsDir, relativeDirectory),
      shouldForce
    );
  }
}

function findFeatureFiles(directory: string): string[] {
  const featureFiles: string[] = [];

  for (const entry of fs.readdirSync(directory, { withFileTypes: true })) {
    const entryPath = path.join(directory, entry.name);
    if (entry.isDirectory()) {
      featureFiles.push(...findFeatureFiles(entryPath));
    } else if (entry.name.endsWith(".feature")) {
      featureFiles.push(entryPath);
    }
  }

  return featureFiles;
}

function printHelp(): void {
  console.log(`
Gherkin to native Cucumber spec and Steps generator

Usage:
  npm run g2f <feature-file>
  npm run g2f -- --dir <feature-directory>
  npm run g2f <feature-file> --force

Outputs:
  src/Tests/specs/{name}.spec.ts
  src/Tests/Steps/{name}.steps.ts

Existing output pairs are preserved unless --force is supplied.
`);
}

function runCli(args: string[]): void {
  if (args.length === 0) {
    printHelp();
    return;
  }

  const force = args.includes("--force");
  const positionalArgs = args.filter((argument) => argument !== "--force");
  if (positionalArgs[0] === "--dir") {
    const inputDir = positionalArgs[1];
    if (!inputDir || !fs.existsSync(inputDir)) {
      throw new Error("An existing input directory is required after --dir.");
    }
    processAllFeatureFiles(inputDir, DEFAULT_SPECS_DIR, DEFAULT_STEPS_DIR, force);
    return;
  }

  const inputFile = positionalArgs[0];
  if (!inputFile || !fs.existsSync(inputFile)) {
    throw new Error("An existing feature file is required.");
  }
  processFeatureFile(inputFile, DEFAULT_SPECS_DIR, DEFAULT_STEPS_DIR, force);
}

if (require.main === module) {
  try {
    runCli(process.argv.slice(2));
  } catch (error) {
    console.error(`❌ ${error instanceof Error ? error.message : String(error)}`);
    process.exitCode = 1;
  }
}

export {
  createBindings,
  processAllFeatureFiles,
  processFeatureFile,
  toStepCommandName,
  toStepsClassName,
  transformGherkinToFunctions,
  transformGherkinToSteps,
};
