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
const { createWebGPU } = require("./createProject");

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
  `);
  process.exit(0);
};

module.exports.version = () => {
  console.log(require("../package.json").version);
  process.exit(0);
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

  const responseBundler = await askBundler.run();

  if (responseBundler == blueBright("Webpack")) {
    allChoice.bundler = "webpack";
  } else if (responseBundler == magentaBright("Vite")) {
    allChoice.bundler = "vite";
  }

  const askLanguage = new AutoComplete({
    name: "language",
    message: "Choose the language: ",
    limit: 2,
    choices: [yellow("JavaScript"), blueBright("TypeScript")],
  });

  const responseLanguage = await askLanguage.run();

  if (responseLanguage == yellow("JavaScript")) {
    allChoice.language = "javascript";
  } else if (responseLanguage == blueBright("TypeScript")) {
    allChoice.language = "typescript";
  }

  const askName = new Input({
    name: "ask project name",
    message: "Enter the project name: ",
  });

  await askName.run().then((value) => {
    allChoice.name = value;
  });

  await createWebGPU(allChoice);
};
