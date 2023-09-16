#!/usr/bin/env node

const { askWebGPU, help, version } = require("./utils/askProject");

const args = process.argv.slice(2);

if (args == 0) {
  askWebGPU();
} else if (args == "-h" || args == "--help") {
  help();
} else if (args == "-v" || args == "--version") {
  version();
}
