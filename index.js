#!/usr/bin/env node

const { askWebGPU, help, version, afterFinish } = require("./utils/askProject");

const args = process.argv.slice(2);

if (args == 0) {
  askWebGPU().then((allOption) => {
    afterFinish(allOption.name);
  });
} else if (args == "-h" || args == "--help") {
  help();
} else if (args == "-v" || args == "--version") {
  version();
}
