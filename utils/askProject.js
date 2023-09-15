const {
  blueBright,
  magentaBright,
  greenBright,
  green,
  cyan,
  yellow,
  gray,
} = require("ansi-colors");

const { AutoComplete, Input } = require("enquirer");

module.exports.help = () => {
  console.log(`
  Usage:
      ${greenBright("npx create-webgpu-app")} ${magentaBright("{")}${yellow(
    "option"
  )}${magentaBright("}")}

  Options:
      ${cyan("-h")}, ${cyan("--help")}          ${gray("Display command help")}
      ${cyan("-v")}, ${cyan("--version")}      ${gray(
    "Display command version"
  )}
      ${cyan("-b")}, ${cyan("--bundler")}      ${gray(
    "Choose bundler"
  )} ${magentaBright("(")}${yellow("Webpack")} or ${green(
    "Vite"
  )}${magentaBright(")")}
      ${cyan("-l")}, ${cyan("--lang")}         ${gray(
    "Choose language"
  )} ${magentaBright("(")}${yellow("JavaScript")} or ${green(
    "TypeScript"
  )}${magentaBright(")")}
  `);
  process.exit(0);
};

module.exports.version = () => {
  console.log(require("../package.json").version);
  process.exit(0);
};

module.exports.bundler = (args, index) => {
  const bundlerName = args[index + 1].toLowerCase();
  if (bundlerName && (bundlerName == "webpack" || bundlerName == "vite")) {
    console.log("Set into: " + bundlerName);
  } else {
    console.log("bad usage");
    process.exit(1);
  }
};

module.exports.language = (args, index) => {
  const languageType = args[index + 1].toLowerCase();
  if (
    languageType &&
    (languageType == "javascript" || languageType == "typescript")
  ) {
    console.log("Set into: " + languageType);
  } else {
    console.log("bad usage");
    process.exit(1);
  }
};

module.exports.askWebGPU = async () => {
  const allChoice = {
    bundler: "",
    language: "",
    name: "",
  };
  const askBundler = new AutoComplete({
    name: "bundler",
    message: "Choose the bundler: ",
    limit: 2,
    choices: [blueBright("Webpack"), magentaBright("Vite")],
  });

  await askBundler.run().then((value) => {
    allChoice.bundler = value;
  });

  const askLanguage = new AutoComplete({
    name: "language",
    message: "Choose the language: ",
    limit: 2,
    choices: [yellow("JavaScript"), blueBright("TypeScript")],
  });

  await askLanguage.run().then((value) => {
    allChoice.language = value;
  });

  const askName = new Input({
    name: "ask project name",
    message: "Enter the project name: ",
  });

  await askName.run().then((value) => {
    allChoice.name = value;
  });

  return allChoice;
};
