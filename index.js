#!/usr/bin/env node

const { createWebGPU } = require("./utils/createProject");

const args = process.argv.slice(2);

createWebGPU();
